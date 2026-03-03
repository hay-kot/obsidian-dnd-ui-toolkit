import { MarkdownRenderChild } from "obsidian";
import { createApp, Component, App as VueApp, defineComponent, h, Ref } from "vue";

type Fn = () => void;

export class VueMarkdown extends MarkdownRenderChild {
  private app: VueApp | null = null;
  private callOnUnload: Fn[] = [];

  public addUnloadFn(fn: Fn) {
    this.callOnUnload.push(fn);
  }

  public mount(component: Component, props: Record<string, unknown>) {
    if (this.app) {
      this.app.unmount();
      this.containerEl.empty();
    }
    this.app = createApp(component, props);
    this.app.mount(this.containerEl);
  }

  public mountReactive(component: Component, propsRef: Ref<Record<string, unknown>>) {
    if (this.app) {
      this.app.unmount();
      this.containerEl.empty();
    }
    const Wrapper = defineComponent({
      setup() {
        return () => h(component, propsRef.value);
      },
    });
    this.app = createApp(Wrapper);
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
