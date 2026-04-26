import { ref } from "vue";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import HealthCard from "lib/components/HealthCard.vue";
import { KeyValueStore } from "lib/services/kv/kv";
import { HealthState } from "lib/domains/healthpoints";
import { ParsedHealthBlock, UnresolvedHealthBlock, HitDice, RawHitDice } from "lib/types";
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

function toTemplateString(input: unknown): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const entries = Object.entries(input as Record<string, unknown>);
    if (entries.length === 1 && entries[0][1] == null) {
      const key = entries[0][0].trim();
      const inner = key.replace(/^\{\s*/, "").replace(/\s*\}$/, "");
      return `{{ ${inner} }}`;
    }
  }
  return null;
}

function resolveTemplateNumber(
  value: unknown,
  fallback: number,
  templateContext: ReturnType<typeof createTemplateContext>,
  warnLabel: string
): number {
  let candidate: unknown = value;
  const maybeTemplate = toTemplateString(candidate);
  if (maybeTemplate && hasTemplateVariables(maybeTemplate)) {
    candidate = processTemplate(maybeTemplate, templateContext);
  }

  if (typeof candidate === "number" && !Number.isNaN(candidate)) {
    return Math.max(0, Math.floor(candidate));
  }
  if (typeof candidate === "string") {
    const parsed = parseInt(candidate, 10);
    if (!Number.isNaN(parsed)) {
      return Math.max(0, parsed);
    }
  }

  console.warn(`${warnLabel} "${String(candidate)}" is not a valid number, using ${fallback}`);
  return fallback;
}

/** Embedded health block (HP + resources + hit dice). Kept for reuse in Character hero layout. */
export class HealthMarkdown extends VueMarkdown {
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private fileContext: FileContext;
  private currentHealthBlock: ParsedHealthBlock | null = null;
  private originalHitdiceValues: Map<string, number | string> = new Map();
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
    this.source = source;
    this.kv = kv;
    this.filePath = filePath;
    this.fileContext = useFileContext(baseView.app, ctx);

    const parsed = HealthService.parseHealthBlock(this.source);
    if (parsed.hitdice) {
      for (const hd of parsed.hitdice) {
        this.originalHitdiceValues.set(hd.dice, hd.value);
      }
    }
  }

  async onload() {
    this.setupFrontmatterChangeListener();
    await this.processAndRender();
  }

  private async processAndRender() {
    const unresolvedBlock = HealthService.parseHealthBlock(this.source);

    const healthBlock = this.processTemplates(unresolvedBlock);
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
        healthState = HealthService.migrateHealthState(savedState, healthBlock);
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

      this.setupEventSubscription(healthBlock);
      this.renderComponent(healthBlock, healthState);
    } catch (error) {
      console.error("Error loading health state:", error);
      this.setupEventSubscription(healthBlock);
      this.renderComponent(healthBlock, defaultState);
    }
  }

  private processTemplates(healthBlock: UnresolvedHealthBlock): ParsedHealthBlock {
    let health: number | string = healthBlock.health;
    const templateContext = createTemplateContext(this.containerEl, this.fileContext);

    // Process health template
    const maybeHealthTemplate = toTemplateString(health);
    if (maybeHealthTemplate && hasTemplateVariables(maybeHealthTemplate)) {
      const processedHealth = processTemplate(maybeHealthTemplate, templateContext);
      const healthValue = parseInt(processedHealth, 10);

      if (!isNaN(healthValue)) {
        health = healthValue;
      } else {
        console.warn(
          `Template processed health value "${processedHealth}" is not a valid number, using original value`
        );
      }
    }

    // Process hitdice value templates
    let hitdice: HitDice[] | undefined;
    if (healthBlock.hitdice) {
      hitdice = healthBlock.hitdice.map((hd) => this.resolveHitDice(hd));
    }

    const resolvedResources = (healthBlock.resources || []).map((resource) => {
      const resolvedMax = resolveTemplateNumber(
        resource.max,
        0,
        templateContext,
        `Template processed resource max for ${resource.key}`
      );
      const resolvedCurrent = resolveTemplateNumber(
        resource.current,
        resolvedMax,
        templateContext,
        `Template processed resource current for ${resource.key}`
      );
      return { ...resource, max: resolvedMax, current: resolvedCurrent };
    });

    const resources = HealthService.resolveHealthResources(resolvedResources);

    return { ...healthBlock, health, hitdice, resources };
  }

  private resolveHitDice(hd: RawHitDice): HitDice {
    const originalValue = this.originalHitdiceValues.get(hd.dice);
    const valueToProcess = originalValue !== undefined ? originalValue : hd.value;

    if (typeof valueToProcess === "string" && hasTemplateVariables(valueToProcess)) {
      const templateContext = createTemplateContext(this.containerEl, this.fileContext);
      const processed = processTemplate(valueToProcess, templateContext);
      const parsed = parseInt(processed, 10);

      if (!isNaN(parsed) && parsed > 0) {
        return { ...hd, value: parsed };
      } else {
        console.warn(
          `Template processed hitdice value "${processed}" for ${hd.dice} is not a valid positive number, using 1`
        );
        return { ...hd, value: 1 };
      }
    }

    if (typeof valueToProcess === "string") {
      const parsed = parseInt(valueToProcess, 10);
      return { dice: hd.dice, value: isNaN(parsed) ? 1 : parsed };
    }

    return { dice: hd.dice, value: valueToProcess };
  }

  private hasTemplateValues(): boolean {
    return hasTemplateVariables(this.source);
  }

  private setupFrontmatterChangeListener() {
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        if (this.hasTemplateValues()) {
          console.debug(`Frontmatter changed for ${this.filePath}, re-processing health templates`);
          this.handleFrontmatterChange();
        }
      })
    );
  }

  private setupEventSubscription(healthBlock: ParsedHealthBlock) {
    const resetOn = healthBlock.reset_on || [{ event: "long-rest" }];

    this.addUnloadFn(
      msgbus.subscribe(this.filePath, "reset", (resetEvent) => {
        if (shouldResetOnEvent(resetOn, resetEvent.eventType)) {
          console.debug(`Resetting health ${healthBlock.state_key} due to ${resetEvent.eventType} event`);
          this.handleResetEvent(healthBlock);
        }
      })
    );
  }

  private async handleFrontmatterChange() {
    try {
      await this.processAndRender();
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

  private async handleResetEvent(healthBlock: ParsedHealthBlock) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      const maxHealth = typeof healthBlock.health === "number" ? healthBlock.health : 6;
      const defaultState = HealthService.getDefaultHealthState(healthBlock);

      const resetState: HealthState = {
        current: maxHealth,
        temporary: 0,
        hitdiceUsed: defaultState.hitdiceUsed,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        resources: defaultState.resources,
      };

      await this.kv.set(stateKey, resetState);
      this.renderComponent(healthBlock, resetState);
    } catch (error) {
      console.error(`Error resetting health state for ${stateKey}:`, error);
    }
  }
}
