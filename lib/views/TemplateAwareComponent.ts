import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import { VueMarkdown } from "./VueMarkdown";
import { FileContext, useFileContext } from "./filecontext";
import { hasTemplateVariables, createTemplateContext, TemplateContext } from "../utils/template";

/**
 * Base class for view components that support Handlebars-style template variables
 * in their YAML source. Handles YAML parsing, template detection, context creation,
 * and re-rendering on frontmatter/ability changes.
 *
 * Subclasses implement `processAndRender()` to define their specific YAML-to-props
 * mapping and Vue component mounting.
 */
export abstract class TemplateAwareComponent extends VueMarkdown {
  protected fileContext: FileContext;
  protected source: string;
  protected isTemplate = false;

  constructor(el: HTMLElement, source: string, app: App, ctx: MarkdownPostProcessorContext) {
    super(el);
    this.source = source;
    this.fileContext = useFileContext(app, ctx);
  }

  async onload() {
    this.setupListeners();
    this.processAndRender();
  }

  protected abstract processAndRender(): void;

  protected parseSource(): Record<string, any> {
    return parse(this.source) || {};
  }

  /**
   * Checks an array of string values for template variables. If any are found,
   * creates and returns a TemplateContext and marks this component as template-aware.
   */
  protected detectTemplates(values: string[]): TemplateContext | null {
    const hasTemplates = values.some((v) => hasTemplateVariables(v));
    if (!hasTemplates) return null;

    this.isTemplate = true;
    return createTemplateContext(this.containerEl, this.fileContext);
  }

  private setupListeners() {
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        if (!this.isTemplate) return;
        this.processAndRender();
      })
    );

    this.addUnloadFn(
      this.fileContext.onAbilitiesChange(() => {
        if (!this.isTemplate) return;
        this.processAndRender();
      })
    );
  }
}
