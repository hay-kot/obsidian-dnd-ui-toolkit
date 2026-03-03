import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as EventButtonsService from "lib/domains/event-buttons";
import EventButtons from "lib/components/EventButtons.vue";
import { msgbus } from "lib/services/event-bus";
import { VueMarkdown } from "./VueMarkdown";

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

class EventButtonsMarkdown extends VueMarkdown {
  private source: string;
  private filePath: string;

  constructor(el: HTMLElement, source: string, filePath: string) {
    super(el);
    this.source = source;
    this.filePath = filePath;
  }

  async onload() {
    try {
      const eventButtonsBlock = EventButtonsService.parseEventButtonsBlock(this.source);

      const wrapper = document.createElement("div");
      wrapper.className = "dnd-ui-event-buttons-wrapper";
      this.containerEl.appendChild(wrapper);

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

      // Use a temporary VueMarkdown to mount into the wrapper
      const mountEl = new VueMarkdown(wrapper);
      mountEl.mount(EventButtons, {
        config: eventButtonsBlock,
        onClick: handleButtonClick,
      });

      // Ensure cleanup on unload
      this.addUnloadFn(() => mountEl.onunload());
    } catch (error) {
      console.error("Error parsing event buttons block:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorDiv = this.containerEl.createEl("div", { cls: "notice" });
      errorDiv.textContent = `Error parsing event buttons block: ${errorMessage}`;
    }
  }
}
