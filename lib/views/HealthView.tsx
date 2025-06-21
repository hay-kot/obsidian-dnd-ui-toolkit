import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import { HealthCard } from "lib/components/health-card";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { KeyValueStore } from "lib/services/kv/kv";
import { HealthState } from "lib/domains/healthpoints";
import { HealthBlock } from "lib/types";
import { eventBus, ResetEvent } from "lib/services/event-bus";

export class HealthView extends BaseView {
  public codeblock = "healthpoints";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const healthMarkdown = new HealthMarkdown(el, source, this.kv, ctx.sourcePath);
    ctx.addChild(healthMarkdown);
  }
}

class HealthMarkdown extends MarkdownRenderChild {
  private reactRoot: ReactDOM.Root | null = null;
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private eventUnsubscriber: (() => void) | null = null;

  constructor(el: HTMLElement, source: string, kv: KeyValueStore, filePath: string) {
    super(el);
    this.source = source;
    this.kv = kv;
    this.filePath = filePath;
  }

  async onload() {
    const healthBlock = HealthService.parseHealthBlock(this.source);

    const stateKey = healthBlock.state_key;
    if (!stateKey) {
      throw new Error("Health block must contain a 'state_key' property.");
    }

    // Initialize with default values
    const defaultState = HealthService.getDefaultHealthState(healthBlock);

    try {
      // Load the initial state
      const savedState = await this.kv.get<HealthState>(stateKey);
      const healthState = savedState || defaultState;

      // If no saved state exists, save the default state
      if (!savedState) {
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

  private renderComponent(healthBlock: HealthBlock, state: HealthState) {
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

  private async handleStateChange(healthBlock: HealthBlock, newState: HealthState) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      // Update state in KV store
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving health state for ${stateKey}:`, error);
    }
  }

  private setupEventSubscription(healthBlock: HealthBlock) {
    // Use the reset_on property or default to 'long-rest'
    const resetOn = healthBlock.reset_on || "long-rest";

    this.eventUnsubscriber = eventBus.subscribe<ResetEvent>("reset", this.filePath, (resetEvent) => {
      if (this.shouldResetOnEvent(resetOn, resetEvent.eventType)) {
        console.debug(`Resetting health ${healthBlock.state_key} due to ${resetEvent.eventType} event`);
        this.handleResetEvent(healthBlock);
      }
    });
  }

  private async handleResetEvent(healthBlock: HealthBlock) {
    const stateKey = healthBlock.state_key;
    if (!stateKey) return;

    try {
      // Reset to full health and clear hit dice usage and death saves
      const resetState: HealthState = {
        current: healthBlock.health, // Restore to maximum health
        temporary: 0, // Clear temporary HP
        hitdiceUsed: 0, // Reset hit dice
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

  /**
   * Check if health should reset based on the given event type
   */
  private shouldResetOnEvent(resetOn: string | string[] | undefined, eventType: string): boolean {
    if (!resetOn) return false;

    if (typeof resetOn === "string") {
      return resetOn === eventType;
    }

    if (Array.isArray(resetOn)) {
      return resetOn.includes(eventType);
    }

    return false;
  }

  onunload() {
    // Clean up React root to prevent memory leaks
    if (this.reactRoot) {
      try {
        this.reactRoot.unmount();
      } catch (e) {
        console.error("Error unmounting React component:", e);
      }
      this.reactRoot = null;
    }

    // Clean up event subscription
    if (this.eventUnsubscriber) {
      try {
        this.eventUnsubscriber();
      } catch (e) {
        console.error("Error unsubscribing from event:", e);
      }
      this.eventUnsubscriber = null;
    }

    console.debug("Unmounted React component and cleaned up event subscription in HealthMarkdown");
  }
}
