import { ref } from "vue";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import HealthCard from "lib/components/HealthCard.vue";
import { KeyValueStore } from "lib/services/kv/kv";
import { HealthState } from "lib/domains/healthpoints";
import { ParsedHealthBlock, UnresolvedHealthBlock, HitDice, RawHitDice, RawResetConfig, ResetConfig } from "lib/types";
import { msgbus } from "lib/services/event-bus";
import { hasTemplateVariables, processTemplate, createTemplateContext } from "lib/utils/template";
import { useFileContext, FileContext } from "./filecontext";
import { shouldResetOnEvent } from "lib/domains/events";
import { VueMarkdown } from "./VueMarkdown";

export class HealthView extends BaseView {
  public codeblock = "healthpoints";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const healthMarkdown = new HealthMarkdown(el, source, this.kv, ctx.sourcePath, ctx, this);
    ctx.addChild(healthMarkdown);
  }
}

class HealthMarkdown extends VueMarkdown {
  private kv: KeyValueStore;
  private filePath: string;
  private fileContext: FileContext;
  private unresolvedBlock: UnresolvedHealthBlock;
  private currentHealthBlock: ParsedHealthBlock | null = null;
  private propsRef = ref<Record<string, unknown>>({});
  private mounted = false;

  constructor(
    el: HTMLElement,
    source: string,
    kv: KeyValueStore,
    filePath: string,
    ctx: MarkdownPostProcessorContext,
    baseView: BaseView
  ) {
    super(el);
    this.kv = kv;
    this.filePath = filePath;
    this.fileContext = useFileContext(baseView.app, ctx);
    this.unresolvedBlock = HealthService.parseHealthBlock(source);
  }

  async onload() {
    this.setupFrontmatterChangeListener();
    await this.processAndRender();
  }

  private async processAndRender() {
    const healthBlock = this.processTemplates(this.unresolvedBlock);
    this.currentHealthBlock = healthBlock;

    const stateKey = healthBlock.state_key;
    if (!stateKey) {
      throw new Error("Health block must contain a 'state_key' property.");
    }

    const defaultState = HealthService.getDefaultHealthState(healthBlock);

    try {
      const savedState = await this.kv.get<HealthState>(stateKey);
      let healthState = savedState || defaultState;

      if (savedState) {
        healthState = this.reconcileState(savedState, healthBlock);
        if (healthState !== savedState) {
          try {
            await this.kv.set(stateKey, healthState);
          } catch (error) {
            console.error("Error saving migrated health state:", error);
          }
        }
      } else {
        try {
          await this.kv.set(stateKey, defaultState);
        } catch (error) {
          console.error("Error saving initial health state:", error);
        }
      }

      this.setupEventSubscription();
      this.renderComponent(healthBlock, healthState);
    } catch (error) {
      console.error("Error loading health state:", error);
      this.setupEventSubscription();
      this.renderComponent(healthBlock, defaultState);
    }
  }

  private reconcileState(state: HealthState, healthBlock: ParsedHealthBlock): HealthState {
    return HealthService.clampHealthState(HealthService.migrateHealthState(state, healthBlock), healthBlock);
  }

  private processTemplates(healthBlock: UnresolvedHealthBlock): ParsedHealthBlock {
    let templateContext: ReturnType<typeof createTemplateContext> | null = null;

    // Resolves templates and plain numeric strings, returning undefined when the result isn't a number
    const resolveNumber = (value: number | string): number | undefined => {
      if (typeof value === "number") return value;

      let text = value;
      if (hasTemplateVariables(value)) {
        templateContext ??= createTemplateContext(this.containerEl, this.fileContext);
        text = processTemplate(value, templateContext);
      }

      const parsed = parseInt(text, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    let health: number | string = healthBlock.health;
    if (typeof health === "string") {
      const resolved = resolveNumber(health);
      if (resolved !== undefined) {
        health = resolved;
      } else {
        console.warn(`Health value "${health}" did not resolve to a valid number, using original value`);
      }
    }

    let tempMaxHealth: number | undefined;
    if (healthBlock.temp_max_health !== undefined) {
      tempMaxHealth = resolveNumber(healthBlock.temp_max_health);
      if (tempMaxHealth === undefined) {
        console.warn(`Temp max health value "${healthBlock.temp_max_health}" is not a valid number, using 0`);
        tempMaxHealth = 0;
      }
    }

    const hitdice = healthBlock.hitdice?.map((hd) => this.resolveHitDice(hd, resolveNumber));

    return {
      ...healthBlock,
      health,
      temp_max_health: tempMaxHealth,
      hitdice,
      reset_on: this.resolveResetConfigs(healthBlock.reset_on, "health", resolveNumber),
    };
  }

  private resolveHitDice(hd: RawHitDice, resolveNumber: (value: number | string) => number | undefined): HitDice {
    const value = resolveNumber(hd.value);
    if (value === undefined || value <= 0) {
      console.warn(`Hitdice value "${hd.value}" for ${hd.dice} is not a valid positive number, using 1`);
    }

    return {
      dice: hd.dice,
      value: value !== undefined && value > 0 ? value : 1,
      reset_on: this.resolveResetConfigs(hd.reset_on, hd.dice, resolveNumber),
    };
  }

  private resolveResetConfigs(
    configs: RawResetConfig[] | string | string[] | undefined,
    label: string,
    resolveNumber: (value: number | string) => number | undefined
  ): ResetConfig[] | undefined {
    if (!Array.isArray(configs)) return undefined;

    return (configs as RawResetConfig[]).map((config) => {
      if (config.amount === undefined) return { event: config.event };

      const amount = resolveNumber(config.amount);
      if (amount === undefined) {
        console.warn(
          `Reset amount "${config.amount}" for ${label} on ${config.event} is not a valid number, falling back to a full reset`
        );
      }

      return { event: config.event, amount: amount === undefined ? undefined : Math.max(0, amount) };
    });
  }

  private hasTemplateValues(): boolean {
    const isTemplate = (value: number | string | undefined) => typeof value === "string" && hasTemplateVariables(value);

    if (isTemplate(this.unresolvedBlock.health) || isTemplate(this.unresolvedBlock.temp_max_health)) {
      return true;
    }

    return (this.unresolvedBlock.hitdice ?? []).some(
      (hd) =>
        isTemplate(hd.value) ||
        (Array.isArray(hd.reset_on) && (hd.reset_on as RawResetConfig[]).some((config) => isTemplate(config.amount)))
    );
  }

  private setupFrontmatterChangeListener() {
    if (!this.hasTemplateValues()) return;

    this.addUnloadFn(this.fileContext.onFrontmatterChange(() => this.handleFrontmatterChange()));
  }

  private setupEventSubscription() {
    this.addUnloadFn(
      msgbus.subscribe(this.filePath, "reset", (resetEvent) => {
        const healthBlock = this.currentHealthBlock;
        if (!healthBlock) return;

        const resetOn = healthBlock.reset_on || [{ event: "long-rest" }];
        const affectsHitDice = (healthBlock.hitdice ?? []).some((hd) =>
          shouldResetOnEvent(hd.reset_on, resetEvent.eventType)
        );

        if (shouldResetOnEvent(resetOn, resetEvent.eventType) || affectsHitDice) {
          this.handleResetEvent(healthBlock, resetEvent.eventType);
        }
      })
    );
  }

  private async handleFrontmatterChange() {
    if (!this.currentHealthBlock) return;

    try {
      const updatedHealthBlock = this.processTemplates(this.unresolvedBlock);

      if (JSON.stringify(this.currentHealthBlock) === JSON.stringify(updatedHealthBlock)) return;

      this.currentHealthBlock = updatedHealthBlock;

      const stateKey = updatedHealthBlock.state_key;
      if (!stateKey) return;

      try {
        const currentState = await this.kv.get<HealthState>(stateKey);
        if (!currentState) return;

        // A shrinking max — an expired temp max health effect, say — has to pull current health down with it
        const reconciled = this.reconcileState(currentState, updatedHealthBlock);
        if (reconciled !== currentState) {
          await this.kv.set(stateKey, reconciled);
        }

        this.renderComponent(updatedHealthBlock, reconciled);
      } catch (error) {
        console.error("Error loading state during frontmatter update:", error);
      }
    } catch (error) {
      console.error("Error handling frontmatter change:", error);
    }
  }

  private renderComponent(healthBlock: ParsedHealthBlock, state: HealthState) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    const newProps = {
      static: healthBlock,
      state: state,
      "onUpdate:state": (newState: HealthState) => {
        this.handleStateChange(healthBlock, newState);
        this.renderComponent(healthBlock, newState);
      },
    };

    if (!this.mounted) {
      this.propsRef.value = newProps;
      this.mountReactive(HealthCard, this.propsRef);
      this.mounted = true;
    } else {
      this.propsRef.value = newProps;
    }
  }

  private async handleStateChange(healthBlock: ParsedHealthBlock, newState: HealthState) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving health state for ${stateKey}:`, error);
    }
  }

  private async handleResetEvent(healthBlock: ParsedHealthBlock, eventType: string) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      const currentState =
        (await this.kv.get<HealthState>(stateKey)) ?? HealthService.getDefaultHealthState(healthBlock);
      const resetState = HealthService.computeResetState(currentState, healthBlock, eventType);

      await this.kv.set(stateKey, resetState);
      this.renderComponent(healthBlock, resetState);
    } catch (error) {
      console.error(`Error resetting health state for ${stateKey}:`, error);
    }
  }
}
