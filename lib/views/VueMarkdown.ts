import { MarkdownRenderChild } from "obsidian";
import { createApp, Component, App as VueApp } from "vue";

type Fn = () => void;

export class VueMarkdown extends MarkdownRenderChild {
  private app: VueApp | null = null;
  private callOnUnload: Fn[] = [];

  public addUnloadFn(fn: Fn) {
    this.callOnUnload.push(fn);
  }

  public mount(component: Component, props: Record<string, unknown>) {
    // Unmount existing app if re-rendering
    if (this.app) {
      this.app.unmount();
      this.containerEl.empty(); // Obsidian's HTMLElement.empty()
    }
    this.app = createApp(component, props);
    this.app.mount(this.containerEl);
  }

  onunload() {
    if (this.app) {
      try {
        this.app.unmount();
      } catch (e) {
        console.error("Error unmounting Vue component:", e);
      }
      this.app = null;
    }

    for (const fn of this.callOnUnload) {
      try {
        fn();
      } catch (e) {
        console.error("Error calling onUnload function:", e);
      }
    }
  }
}
