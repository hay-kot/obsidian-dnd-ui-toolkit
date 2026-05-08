import { BaseView } from "./BaseView";
import BadgesRow from "../components/BadgesRow.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { BadgeItem, BadgesBlock } from "lib/types";
import { processTemplate } from "../utils/template";
import StatCards from "../components/StatCards.vue";
import { TemplateAwareComponent } from "./TemplateAwareComponent";

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

class StatsLikeComponent extends TemplateAwareComponent {
  layout: "badges" | "cards" = "badges";

  protected processAndRender() {
    const parsed = this.parseSource();
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const grid = parsed.grid || {};

    const templateContext = this.setupTemplates(
      items.flatMap((item: Partial<BadgeItem>) => [
        String(item.label ?? ""),
        String(item.value ?? ""),
        String(item.sublabel ?? ""),
      ])
    );

    const badgesBlock: BadgesBlock = {
      items: items.map((item: Partial<BadgeItem>) => {
        let label = String(item.label ?? "");
        let value = String(item.value ?? "");
        let sublabel = String(item.sublabel ?? "");

        if (templateContext) {
          label = processTemplate(label, templateContext);
          value = processTemplate(value, templateContext);
          sublabel = processTemplate(sublabel, templateContext);
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
}
