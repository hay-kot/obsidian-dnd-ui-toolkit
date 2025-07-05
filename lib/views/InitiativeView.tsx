import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { Initiative } from "lib/components/initiative";
import * as InitiativeService from "lib/domains/initiative";
import type { InitiativeState } from "lib/domains/initiative";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { KeyValueStore } from "lib/services/kv/kv";
import { InitiativeBlock } from "lib/types";

export class InitiativeView extends BaseView {
  public codeblock = "initiative";

  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const initiativeMarkdown = new InitiativeMarkdown(el, source, this.kv);
    ctx.addChild(initiativeMarkdown);
  }
}

class InitiativeMarkdown extends MarkdownRenderChild {
  private reactRoot: ReactDOM.Root | null = null;
  private source: string;
  private kv: KeyValueStore;

  constructor(el: HTMLElement, source: string, kv: KeyValueStore) {
    super(el);
    this.source = source;
    this.kv = kv;
  }

  async onload() {
    const initiativeBlock = InitiativeService.parseInitiativeBlock(this.source);

    const stateKey = initiativeBlock.state_key;
    if (!stateKey) {
      throw new Error("Initiative block must contain a 'state_key' property.");
    }

    // Initialize with default values
    const defaultState = InitiativeService.getDefaultInitiativeState(initiativeBlock);

    try {
      // Load the initial state
      const savedState = await this.kv.get<InitiativeState>(stateKey);
      const initiativeState = savedState || defaultState;

      // If no saved state exists, save the default state
      if (!savedState) {
        try {
          await this.kv.set(stateKey, defaultState);
        } catch (error) {
          console.error("Error saving initial initiative state:", error);
        }
      }

      // Render with the state we have
      this.renderComponent(initiativeBlock, initiativeState);
    } catch (error) {
      console.error("Error loading initiative state:", error);
      // Fallback to default state if there's an error
      this.renderComponent(initiativeBlock, defaultState);
    }
  }

  private renderComponent(block: InitiativeBlock, state: InitiativeState) {
    const stateKey = block.state_key;
    if (!stateKey) return;

    const data = {
      static: block,
      state: state,
      onStateChange: (newState: InitiativeState) => {
        // Update the state first
        this.handleStateChange(block, newState);

        // Re-render with the new state
        this.renderComponent(block, newState);
      },
    };

    // Create or reuse a React root
    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.containerEl);
    }

    this.reactRoot.render(React.createElement(Initiative, data));
  }

  private async handleStateChange(initiativeBlock: InitiativeBlock, newState: InitiativeState) {
    const stateKey = initiativeBlock.state_key;
    if (!stateKey) return;

    try {
      // Update state in KV store
      await this.kv.set(stateKey, newState);
    } catch (error) {
      console.error(`Error saving initiative state for ${stateKey}:`, error);
    }
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
      console.debug("Unmounted React component in InitiativeMarkdown");
    }
  }
}
