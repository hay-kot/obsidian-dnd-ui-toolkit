import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import SkillCards from "../components/SkillCards.vue";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import type { SkillItem } from "lib/types";
import { hasTemplateVariables, processTemplate, createTemplateContext, TemplateContext } from "../utils/template";
import { FileContext, useFileContext } from "./filecontext";

export class RawSkillsView extends BaseView {
  public codeblock = "skill-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new RawSkillsComponent(el, source, this.app, ctx);
    ctx.addChild(cmp);
  }
}

class RawSkillsComponent extends VueMarkdown {
  ctx: FileContext;
  source: string;
  isTemplate = false;

  constructor(el: HTMLElement, source: string, app: App, ctx: MarkdownPostProcessorContext) {
    super(el);
    this.source = source;
    this.ctx = useFileContext(app, ctx);
  }

  async onload() {
    this.setupListeners();
    this.processAndRender();
  }

  private processAndRender() {
    const parsed = parse(this.source);
    const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];

    const hasTemplates = rawItems.some(
      (item: any) =>
        hasTemplateVariables(String(item.label || "")) ||
        hasTemplateVariables(String(item.ability || "")) ||
        hasTemplateVariables(String(item.modifier ?? ""))
    );

    let templateContext: TemplateContext | null = null;
    if (hasTemplates) {
      templateContext = createTemplateContext(this.containerEl, this.ctx);
      this.isTemplate = true;
    }

    const items: SkillItem[] = rawItems.map((item: any) => {
      let label = String(item.label || "");
      let ability = String(item.ability || "");
      let modifierStr = String(item.modifier ?? "0");

      if (templateContext) {
        if (hasTemplateVariables(label)) label = processTemplate(label, templateContext);
        if (hasTemplateVariables(ability)) ability = processTemplate(ability, templateContext);
        if (hasTemplateVariables(modifierStr)) modifierStr = processTemplate(modifierStr, templateContext);
      }

      return {
        label,
        ability,
        modifier: Number(modifierStr) || 0,
        isProficient: item.proficiency === "proficient",
        isExpert: item.proficiency === "expert",
        isHalfProficient: item.proficiency === "half",
      };
    });

    this.mount(SkillCards, { items });
  }

  private setupListeners() {
    this.addUnloadFn(
      this.ctx.onFrontmatterChange(() => {
        if (!this.isTemplate) return;
        this.processAndRender();
      })
    );

    this.addUnloadFn(
      this.ctx.onAbilitiesChange(() => {
        if (!this.isTemplate) return;
        this.processAndRender();
      })
    );
  }
}
