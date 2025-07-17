import { BaseView } from "./BaseView";
import { BadgesRow } from "../components/badges";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { BadgeItem, BadgesBlock } from "lib/types";
import { parse } from "yaml";
import { hasTemplateVariables, processTemplate, createTemplateContext, TemplateContext } from "../utils/template";
import { FileContext, useFileContext } from "./filecontext";
import { ReactMarkdown } from "./ReactMarkdown";

import { StatsGridItems } from "../components/stat-cards";

import * as React from "react";
import * as ReactDOM from "react-dom/client";

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

class StatsLikeComponent extends ReactMarkdown {
  layout: "badges" | "cards" = "badges"; // Default layout
  ctx: FileContext;
  source: string; // The source code of the badges block
  isTemplate: boolean; // Indicates that atleast one badge is a template

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

    // Check if any items contain template variables
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

    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.containerEl);
    }

    if (this.layout === "badges") {
      this.reactRoot.render(React.createElement(BadgesRow, { data: badgesBlock }));
    } else if (this.layout === "cards") {
      this.reactRoot.render(React.createElement(StatsGridItems, badgesBlock));
    }
  }

  private setupListeners() {
    this.addUnloadFn(
      this.ctx.onFrontmatterChange((_) => {
        if (!this.isTemplate) {
          // No template means we have nothing to do.
          return;
        }

        // recall processAndRender()
        this.processAndRender();
      })
    );

    this.addUnloadFn(
      this.ctx.onAbilitiesChange(() => {
        if (!this.isTemplate) {
          // No template means we have nothing to do.
          return;
        }

        // recall processAndRender()
        this.processAndRender();
      })
    );
  }
}
