import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import * as ConsumableService from "lib/domains/consumables";
import { ConsumableCheckboxes } from "lib/components/consumable-checkboxes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { KeyValueStore } from "lib/services/kv/kv";
import { ConsumableState } from "lib/domains/consumables";
import { msgbus } from "lib/services/event-bus";
import { shouldResetOnEvent, getResetAmount } from "lib/domains/events";
import { ParsedConsumableBlock } from "lib/types";

export class ConsumableView extends BaseView {
  public codeblock = "consumable";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const consumableMarkdown = new ConsumableMarkdown(el, source, this.kv, ctx.sourcePath);
    ctx.addChild(consumableMarkdown);
  }
}

class ConsumableMarkdown extends MarkdownRenderChild {
  private reactRoots: Map<string, ReactDOM.Root> = new Map();
  private source: string;
  private kv: KeyValueStore;
  private filePath: string;
  private consumablesContainer: HTMLElement;
  private eventUnsubscribers: (() => void)[] = [];

  constructor(el: HTMLElement, source: string, kv: KeyValueStore, filePath: string) {
    super(el);
    this.source = source;
    this.kv = kv;
    this.filePath = filePath;
    this.consumablesContainer = document.createElement("div");
    this.consumablesContainer.className = "consumables-column";
    el.appendChild(this.consumablesContainer);
  }

  async onload() {
    const consumablesBlock = ConsumableService.parseConsumablesBlock(this.source);

    // Find the longest label to calculate proper alignment
    let maxLabelLength = 0;
    consumablesBlock.items.forEach((item) => {
      if (item.label && item.label.length > maxLabelLength) {
        maxLabelLength = item.label.length;
      }
    });

    // Apply the calculated width to a CSS variable
    const labelWidthEm = Math.max(3, maxLabelLength * 0.55); // Adjust multiplier based on font size
    this.consumablesContainer.style.setProperty("--consumable-label-width", `${labelWidthEm}em`);

    // Process each consumable item
    await Promise.all(
      consumablesBlock.items.map(async (consumableBlock, index) => {
        const stateKey = consumableBlock.state_key;
        if (!stateKey) {
          throw new Error(`Consumable item at index ${index} must contain a 'state_key' property.`);
        }

        const itemContainer = document.createElement("div");
        itemContainer.className = "consumable-item";
        itemContainer.setAttribute("data-state-key", stateKey);
        this.consumablesContainer.appendChild(itemContainer);

        // Initialize with default values
        const defaultState = ConsumableService.getDefaultConsumableState(consumableBlock);

        try {
          // Load the initial state
          const savedState = await this.kv.get<ConsumableState>(stateKey);
          const consumableState = savedState || defaultState;

          // If no saved state exists, save the default state
          if (!savedState) {
            try {
              await this.kv.set(stateKey, defaultState);
            } catch (error) {
              console.error(`Error saving initial consumable state for ${stateKey}:`, error);
            }
          }

          // Set up event subscription for reset functionality
          if (consumableBlock.reset_on) {
            const unsubscribe = msgbus.subscribe(this.filePath, "reset", (resetEvent) => {
              if (shouldResetOnEvent(consumableBlock.reset_on, resetEvent.eventType)) {
                console.debug(`Resetting consumable ${stateKey} due to ${resetEvent.eventType} event`);
                // Get the amount from the configuration, falling back to event amount for backward compatibility
                const resetAmount = getResetAmount(consumableBlock.reset_on, resetEvent.eventType) || resetEvent.amount;
                this.handleResetEvent(consumableBlock, resetAmount);
              }
            });
            this.eventUnsubscribers.push(unsubscribe);
          }

          // Render with the state we have
          this.renderComponent(itemContainer, consumableBlock, consumableState);
        } catch (error) {
          console.error(`Error loading consumable state for ${stateKey}:`, error);

          // Set up event subscription even for error case
          if (consumableBlock.reset_on) {
            const unsubscribe = msgbus.subscribe(this.filePath, "reset", (resetEvent) => {
              if (shouldResetOnEvent(consumableBlock.reset_on, resetEvent.eventType)) {
                console.debug(`Resetting consumable ${stateKey} due to ${resetEvent.eventType} event`);
                // Get the amount from the configuration, falling back to event amount for backward compatibility
                const resetAmount = getResetAmount(consumableBlock.reset_on, resetEvent.eventType) || resetEvent.amount;
                this.handleResetEvent(consumableBlock, resetAmount);
              }
            });
            this.eventUnsubscribers.push(unsubscribe);
          }

          // Fallback to default state if there's an error
          this.renderComponent(itemContainer, consumableBlock, defaultState);
        }
      })
    );
  }

  private renderComponent(container: HTMLElement, consumableBlock: ParsedConsumableBlock, state: ConsumableState) {
    const stateKey = consumableBlock.state_key || "";

    const data = {
      static: consumableBlock,
      state: state,
      onStateChange: (newState: ConsumableState) => {
        // Update the state first
        this.handleStateChange(consumableBlock, newState);

        // Re-render with the new state
        this.renderComponent(container, consumableBlock, newState);
      },
    };

    // Create or reuse a React root
    let root: ReactDOM.Root;
    if (this.reactRoots.has(stateKey)) {
      root = this.reactRoots.get(stateKey)!;
    } else {
      root = ReactDOM.createRoot(container);
      this.reactRoots.set(stateKey, root);
    }

    root.render(React.createElement(ConsumableCheckboxes, data));
  }

  private async handleStateChange(consumableBlock: ParsedConsumableBlock, newState: ConsumableState) {
    const stateKey = consumableBlock.state_key;
    if (!stateKey) return;

    try {
      // Update state in KV store
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving consumable state for ${stateKey}:`, error);
    }
  }

  private async handleResetEvent(consumableBlock: ParsedConsumableBlock, amount?: number) {
    const stateKey = consumableBlock.state_key;
    if (!stateKey) return;

    try {
      // Get current state to determine the reset value
      const currentState = await this.kv.get<ConsumableState>(stateKey);
      const currentValue = currentState?.value || 0;

      // If amount is specified, restore that amount of uses (subtract from current usage)
      // If amount is undefined, reset to full (0 used consumables)
      const resetState: ConsumableState = {
        value: amount !== undefined ? Math.max(0, currentValue - amount) : 0,
      };

      await this.kv.set(stateKey, resetState);

      // Find the container for this consumable and re-render it
      const container = this.consumablesContainer.querySelector(`[data-state-key="${stateKey}"]`) as HTMLElement;
      if (container) {
        this.renderComponent(container, consumableBlock, resetState);
      }
    } catch (error) {
      console.error(`Error resetting consumable state for ${stateKey}:`, error);
    }
  }

  onunload() {
    // Clean up all React roots to prevent memory leaks
    this.reactRoots.forEach((root) => {
      try {
        root.unmount();
      } catch (e) {
        console.error("Error unmounting React component:", e);
      }
    });
    this.reactRoots.clear();

    // Clean up event subscriptions
    this.eventUnsubscribers.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (e) {
        console.error("Error unsubscribing from event:", e);
      }
    });
    this.eventUnsubscribers.length = 0;

    console.debug("Unmounted all React components and cleaned up event subscriptions in ConsumableMarkdown");
  }
}
