import { ref } from "vue";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import HealthCard from "lib/components/HealthCard.vue";
import { KeyValueStore } from "lib/services/kv/kv";
import { HealthState } from "lib/domains/healthpoints";
import { ParsedHealthBlock } from "lib/types";
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
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private fileContext: FileContext;
  private currentHealthBlock: ParsedHealthBlock | null = null;
  private originalHealthValue: number | string;
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
    this.originalHealthValue = HealthService.parseHealthBlock(this.source).health;
  }

  async onload() {
    this.setupFrontmatterChangeListener();
    await this.processAndRender();
  }

  private async processAndRender() {
    let healthBlock = HealthService.parseHealthBlock(this.source);

    healthBlock = this.processTemplateInHealthBlock(healthBlock);
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

  private processTemplateInHealthBlock(healthBlock: ParsedHealthBlock): ParsedHealthBlock {
    if (typeof healthBlock.health === "string" && hasTemplateVariables(healthBlock.health)) {
      const templateContext = createTemplateContext(this.containerEl, this.fileContext);
      const processedHealth = processTemplate(healthBlock.health, templateContext);
      const healthValue = parseInt(processedHealth, 10);

      if (!isNaN(healthValue)) {
        return { ...healthBlock, health: healthValue };
      } else {
        console.warn(
          `Template processed health value "${processedHealth}" is not a valid number, using original value`
        );
      }
    }
    return healthBlock;
  }

  private setupFrontmatterChangeListener() {
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        if (typeof this.originalHealthValue === "string" && hasTemplateVariables(this.originalHealthValue)) {
          console.debug(`Frontmatter changed for ${this.filePath}, re-processing health template`);
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
    if (!this.currentHealthBlock) return;

    try {
      const updatedHealthBlock = this.processTemplateInHealthBlock({
        ...this.currentHealthBlock,
        health: this.originalHealthValue,
      });

      const oldHealth = typeof this.currentHealthBlock.health === "number" ? this.currentHealthBlock.health : 6;
      const newHealth = typeof updatedHealthBlock.health === "number" ? updatedHealthBlock.health : 6;

      if (oldHealth !== newHealth) {
        console.debug(`Health value changed from ${oldHealth} to ${newHealth}, updating max health`);

        this.currentHealthBlock = updatedHealthBlock;

        const stateKey = updatedHealthBlock.state_key;
        if (stateKey) {
          try {
            const currentState = await this.kv.get<HealthState>(stateKey);
            if (currentState) {
              this.renderComponent(updatedHealthBlock, currentState);
            }
          } catch (error) {
            console.error("Error loading state during frontmatter update:", error);
          }
        }
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
      };

      await this.kv.set(stateKey, resetState);
      this.renderComponent(healthBlock, resetState);
    } catch (error) {
      console.error(`Error resetting health state for ${stateKey}:`, error);
    }
  }
}
