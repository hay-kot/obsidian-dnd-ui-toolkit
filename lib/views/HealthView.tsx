import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import { HealthCard } from "lib/components/health-card";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { KeyValueStore } from "lib/services/kv/kv";
import { HealthState } from "lib/domains/healthpoints";
import { ParsedHealthBlock } from "lib/types";
import { msgbus } from "lib/services/event-bus";
import { hasTemplateVariables, processTemplate, createTemplateContext } from "lib/utils/template";
import { useFileContext, FileContext } from "./filecontext";
import { shouldResetOnEvent } from "lib/domains/events";
import { ReactMarkdown } from "./ReactMarkdown";

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

class HealthMarkdown extends ReactMarkdown {
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private fileContext: FileContext;
  private currentHealthBlock: ParsedHealthBlock | null = null;
  private originalHealthValue: number | string;

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
    // Set up frontmatter change listener using filecontext
    this.setupFrontmatterChangeListener();

    // Process and render initial state
    await this.processAndRender();
  }

  private async processAndRender() {
    let healthBlock = HealthService.parseHealthBlock(this.source);

    // Process template for health value if it contains template variables
    healthBlock = this.processTemplateInHealthBlock(healthBlock);
    this.currentHealthBlock = healthBlock;

    const stateKey = healthBlock.state_key;
    if (!stateKey) {
      throw new Error("Health block must contain a 'state_key' property.");
    }

    // Initialize with default values
    const defaultState = HealthService.getDefaultHealthState(healthBlock);

    try {
      // Load the initial state
      const savedState = await this.kv.get<HealthState>(stateKey);
      let healthState = savedState || defaultState;

      // Migrate state if needed (for multiclass hit dice support)
      if (savedState) {
        healthState = HealthService.migrateHealthState(savedState, healthBlock);
        // Save migrated state if it changed
        if (healthState !== savedState) {
          try {
            await this.kv.set(stateKey, healthState);
          } catch (error) {
            console.error("Error saving migrated health state:", error);
          }
        }
      } else {
        // If no saved state exists, save the default state
        try {
          await this.kv.set(stateKey, defaultState);
        } catch (error) {
          console.error("Error saving initial health state:", error);
        }
      }

      // Set up event subscription for reset functionality
      this.setupEventSubscription(healthBlock);

      // Render with the state we have
      this.renderComponent(healthBlock, healthState);
    } catch (error) {
      console.error("Error loading health state:", error);

      // Set up event subscription even for error case
      this.setupEventSubscription(healthBlock);

      // Fallback to default state if there's an error
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
        // Only re-process if we have template variables in the original health value
        if (typeof this.originalHealthValue === "string" && hasTemplateVariables(this.originalHealthValue)) {
          console.debug(`Frontmatter changed for ${this.filePath}, re-processing health template`);
          this.handleFrontmatterChange();
        }
      })
    );
  }

  private setupEventSubscription(healthBlock: ParsedHealthBlock) {
    // Use the reset_on property or default to 'long-rest'
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
      // Re-process the template with updated frontmatter
      const updatedHealthBlock = this.processTemplateInHealthBlock({
        ...this.currentHealthBlock,
        health: this.originalHealthValue,
      });

      // Check if the processed health value actually changed
      const oldHealth = typeof this.currentHealthBlock.health === "number" ? this.currentHealthBlock.health : 6;
      const newHealth = typeof updatedHealthBlock.health === "number" ? updatedHealthBlock.health : 6;

      if (oldHealth !== newHealth) {
        console.debug(`Health value changed from ${oldHealth} to ${newHealth}, updating max health`);

        this.currentHealthBlock = updatedHealthBlock;

        // Get current state and re-render with new max health
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

    const data = {
      static: healthBlock,
      state: state,
      onStateChange: (newState: HealthState) => {
        // Update the state first
        this.handleStateChange(healthBlock, newState);

        // Re-render with the new state
        this.renderComponent(healthBlock, newState);
      },
    };

    // Create or reuse a React root
    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.containerEl);
    }

    this.reactRoot.render(React.createElement(HealthCard, data));
  }

  private async handleStateChange(healthBlock: ParsedHealthBlock, newState: HealthState) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      // Update state in KV store
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving health state for ${stateKey}:`, error);
    }
  }

  private async handleResetEvent(healthBlock: ParsedHealthBlock) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      // Ensure health is a number for reset
      const maxHealth = typeof healthBlock.health === "number" ? healthBlock.health : 6;

      // Get default state to properly initialize hitdiceUsed
      const defaultState = HealthService.getDefaultHealthState(healthBlock);

      // Reset to full health and clear hit dice usage and death saves
      const resetState: HealthState = {
        current: maxHealth, // Restore to maximum health
        temporary: 0, // Clear temporary HP
        hitdiceUsed: defaultState.hitdiceUsed, // Reset hit dice with proper structure
        deathSaveSuccesses: 0, // Clear death saves
        deathSaveFailures: 0, // Clear death saves
      };

      await this.kv.set(stateKey, resetState);

      // Re-render with the reset state
      this.renderComponent(healthBlock, resetState);
    } catch (error) {
      console.error(`Error resetting health state for ${stateKey}:`, error);
    }
  }
}
