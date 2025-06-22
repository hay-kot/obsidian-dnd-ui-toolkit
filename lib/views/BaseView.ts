import { MarkdownPostProcessorContext } from "obsidian";
import { App } from "obsidian";

/**
 * BaseView handles the basic registration of components and creates consistent logic for rendering.
 * It can be used for simple views that are static and don't review dynamic data or re-rendering
 * For more complex components, it's implementation needs to be expetended to support the mounting
 * of react components.
 * */
export abstract class BaseView {
  public app: App;
  public abstract codeblock: string;

  constructor(app: App) {
    this.app = app;
  }

  // Changed return type from string to HTMLElement or void
  public abstract render(
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): HTMLElement | string | void;

  public register(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    const div = el.createEl("div");
    try {
      const result = this.render(source, el, ctx);

      // Handle different return types from render
      if (result instanceof HTMLElement) {
        div.appendChild(result);
      } else if (typeof result === "string") {
        div.innerHTML = result;
      } else {
        console.debug("No result to render");
      }
    } catch (e) {
      console.error("Error rendering code block", e);
      // Using a type assertion to handle the potential error type mismatch
      const errorMessage = e instanceof Error ? e.message : String(e);
      div.innerHTML = `<div class="notice">Error parsing stats block: ${errorMessage}</div>`;
    }
  }
}
