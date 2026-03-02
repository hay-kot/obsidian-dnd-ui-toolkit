import { BaseView } from "./BaseView";
import BadgesRow from "../components/BadgesRow.vue";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { BadgeItem, BadgesBlock } from "lib/types";
import { parse } from "yaml";
import { hasTemplateVariables, processTemplate, createTemplateContext, TemplateContext } from "../utils/template";
import { FileContext, useFileContext } from "./filecontext";
import { VueMarkdown } from "./VueMarkdown";
import StatCards from "../components/StatCards.vue";

export class StatsView extends BaseView {
  public codeblock = "stats";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new StatsLikeComponent(el, source, this.app, ctx);
    cmp.layout = "cards";
    ctx.addChild(cmp);
  }
}

export class BadgesView extends BaseView {
  public codeblock = "badges";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new StatsLikeComponent(el, source, this.app, ctx);
    ctx.addChild(cmp);
  }
}

class StatsLikeComponent extends VueMarkdown {
  layout: "badges" | "cards" = "badges";
  ctx: FileContext;
  source: string;
  isTemplate: boolean;

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
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const grid = parsed.grid || {};

    const hasTemplates = items.some(
      (item: Partial<BadgeItem>) =>
        hasTemplateVariables(String(item.label || "")) || hasTemplateVariables(String(item.value || ""))
    );

    let templateContext: TemplateContext | null = null;
    if (hasTemplates) {
      templateContext = createTemplateContext(this.containerEl, this.ctx);
      this.isTemplate = true;
    }

    const badgesBlock: BadgesBlock = {
      items: items.map((item: Partial<BadgeItem>) => {
        let label = String(item.label || "");
        let value = String(item.value || "");
        let sublabel = String(item.sublabel || "");

        if (templateContext) {
          if (hasTemplateVariables(label)) {
            label = processTemplate(label, templateContext);
          }
          if (hasTemplateVariables(value)) {
            value = processTemplate(value, templateContext);
          }
          if (hasTemplateVariables(sublabel)) {
            sublabel = processTemplate(sublabel, templateContext);
          }
        }

        return {
          reverse: Boolean(item.reverse),
          label,
          value,
          sublabel,
        };
      }),
      dense: Boolean(parsed.dense),
      grid: {
        columns: typeof grid.columns === "number" ? grid.columns : undefined,
      },
    };

    if (this.layout === "badges") {
      this.mount(BadgesRow, { data: badgesBlock });
    } else if (this.layout === "cards") {
      this.mount(StatCards, { items: badgesBlock.items, grid: badgesBlock.grid, dense: badgesBlock.dense });
    }
  }

  private setupListeners() {
    this.addUnloadFn(
      this.ctx.onFrontmatterChange((_) => {
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
