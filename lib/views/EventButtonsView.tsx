import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import * as EventButtonsService from "lib/domains/event-buttons";
import { EventButtons } from "lib/components/event-buttons";
import { EventButtonsBlock } from "lib/types";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { msgbus } from "lib/services/event-bus";

export class EventButtonsView extends BaseView {
  public codeblock = "event-btns";

  constructor(app: App) {
    super(app);
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const eventButtonsMarkdown = new EventButtonsMarkdown(el, source, ctx.sourcePath);
    ctx.addChild(eventButtonsMarkdown);
  }
}

class EventButtonsMarkdown extends MarkdownRenderChild {
  private reactRoot: ReactDOM.Root | null = null;
  private source: string;
  private filePath: string;
  private container: HTMLElement;

  constructor(el: HTMLElement, source: string, filePath: string) {
    super(el);
    this.source = source;
    this.filePath = filePath;
    this.container = document.createElement("div");
    this.container.className = "event-buttons-wrapper";
    el.appendChild(this.container);
  }

  async onload() {
    try {
      const eventButtonsBlock = EventButtonsService.parseEventButtonsBlock(this.source);
      this.renderComponent(eventButtonsBlock);
    } catch (error) {
      console.error("Error parsing event buttons block:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.container.innerHTML = `<div class="notice">Error parsing event buttons block: ${errorMessage}</div>`;
    }
  }

  private renderComponent(config: EventButtonsBlock) {
    const handleButtonClick = (value: string | { event: string; amount: number }) => {
      if (typeof value === "string") {
        console.debug(`EventButtons: Dispatching reset event '${value}' for file '${this.filePath}'`);
        msgbus.publish(this.filePath, "reset", {
          eventType: value,
          filePath: this.filePath,
        });
      } else {
        console.debug(
          `EventButtons: Dispatching reset event '${value.event}' with amount ${value.amount} for file '${this.filePath}'`
        );
        msgbus.publish(this.filePath, "reset", {
          eventType: value.event,
          filePath: this.filePath,
          amount: value.amount,
        });
      }
    };

    const data = {
      config,
      onButtonClick: handleButtonClick,
    };

    // Create React root if it doesn't exist
    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.container);
    }

    this.reactRoot.render(React.createElement(EventButtons, data));
  }

  onunload() {
    // Clean up React root to prevent memory leaks
    if (this.reactRoot) {
      try {
        this.reactRoot.unmount();
        this.reactRoot = null;
      } catch (e) {
        console.error("Error unmounting EventButtons React component:", e);
      }
    }
    console.debug("Unmounted EventButtons React component");
  }
}
