import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import * as ConsumableService from "lib/domains/consumables";
import { ConsumableCheckboxes } from "lib/components/consumable-checkboxes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { KeyValueStore } from "lib/services/kv/kv";
import { ConsumableState } from "lib/domains/consumables";

export class ConsumableView extends BaseView {
  public codeblock = "consumable";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const consumableMarkdown = new ConsumableMarkdown(el, source, this.kv);
    ctx.addChild(consumableMarkdown);
  }
}

class ConsumableMarkdown extends MarkdownRenderChild {
  private reactRoots: Map<string, ReactDOM.Root> = new Map();
  private source: string;
  private kv: KeyValueStore;
  private consumablesContainer: HTMLElement;

  constructor(el: HTMLElement, source: string, kv: KeyValueStore) {
    super(el);
    this.source = source;
    this.kv = kv;
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
        const itemContainer = document.createElement("div");
        itemContainer.className = "consumable-item";
        this.consumablesContainer.appendChild(itemContainer);

        const stateKey = consumableBlock.state_key;
        if (!stateKey) {
          throw new Error(`Consumable item at index ${index} must contain a 'state_key' property.`);
        }

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

          // Render with the state we have
          this.renderComponent(itemContainer, consumableBlock, consumableState);
        } catch (error) {
          console.error(`Error loading consumable state for ${stateKey}:`, error);
          // Fallback to default state if there's an error
          this.renderComponent(itemContainer, consumableBlock, defaultState);
        }
      })
    );
  }

  private renderComponent(
    container: HTMLElement,
    consumableBlock: ConsumableService.ConsumablesBlock["items"][0],
    state: ConsumableState
  ) {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      root = this.reactRoots.get(stateKey)!;
    } else {
      root = ReactDOM.createRoot(container);
      this.reactRoots.set(stateKey, root);
    }

    root.render(React.createElement(ConsumableCheckboxes, data));
  }

  private async handleStateChange(
    consumableBlock: ConsumableService.ConsumablesBlock["items"][0],
    newState: ConsumableState
  ) {
    const stateKey = consumableBlock.state_key;
    if (!stateKey) return;

    try {
      // Update state in KV store
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving consumable state for ${stateKey}:`, error);
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
    console.debug("Unmounted all React components in ConsumableMarkdown");
  }
}
