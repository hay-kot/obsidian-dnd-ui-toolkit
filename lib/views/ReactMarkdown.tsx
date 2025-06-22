import { MarkdownRenderChild } from "obsidian";
import * as ReactDOM from "react-dom/client";

type Fn = () => void;

export class ReactMarkdown extends MarkdownRenderChild {
  protected reactRoot: ReactDOM.Root | null = null;
  private callOnUnload: Fn[] = [];

  public addUnloadFn(fn: Fn) {
    this.callOnUnload.push(fn);
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

    for (const fn of this.callOnUnload) {
      try {
        fn();
      } catch (e) {
        console.error("Error calling onUnload function:", e);
      }
    }

    console.debug("Unmounted React component and cleaned up all subscriptions in HealthMarkdown");
  }
}
