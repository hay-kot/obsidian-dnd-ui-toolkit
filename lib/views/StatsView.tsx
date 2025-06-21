import * as Tmpl from "lib/html-templates";
import { BaseView } from "./BaseView";
import { StatsGridItems } from "../components/stat-cards";
import { MarkdownPostProcessorContext } from "obsidian";
import { StatItem, StatsBlock } from "lib/types";
import { parse } from "yaml";
import { hasTemplateVariables, processTemplate, createTemplateContext, TemplateContext } from "../utils/template";

export class StatsView extends BaseView {
  public codeblock = "stats";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): string {
    const parsed = parse(source);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const grid = parsed.grid || {};

    // Check if any items contain template variables
    const hasTemplates = items.some(
      (item: Partial<StatItem>) =>
        hasTemplateVariables(String(item.label || "")) ||
        hasTemplateVariables(String(item.value || "")) ||
        (item.sublabel && hasTemplateVariables(String(item.sublabel)))
    );

    let templateContext: TemplateContext | null = null;
    if (hasTemplates) {
      templateContext = createTemplateContext(el, ctx, this);
    }

    const statsBlock: StatsBlock = {
      items: items.map((item: Partial<StatItem>) => {
        let label = String(item.label || "");
        let value = item.value !== undefined ? String(item.value) : "";
        let sublabel = item.sublabel !== undefined ? String(item.sublabel) : undefined;

        if (templateContext) {
          if (hasTemplateVariables(label)) {
            label = processTemplate(label, templateContext);
          }
          if (hasTemplateVariables(value)) {
            value = processTemplate(value, templateContext);
          }
          if (sublabel && hasTemplateVariables(sublabel)) {
            sublabel = processTemplate(sublabel, templateContext);
          }
        }

        return {
          label,
          value,
          sublabel,
        };
      }),
      grid: {
        columns: typeof grid.columns === "number" ? grid.columns : undefined,
      },
    };

    return Tmpl.Render(StatsGridItems(statsBlock));
  }
}
