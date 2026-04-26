import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild, TFile, normalizePath } from "obsidian";
import { KeyValueStore } from "lib/services/kv/kv";
import { parse, stringify } from "yaml";
import { BadgeItem, BadgesBlock } from "lib/types";
import BadgesRow from "../components/BadgesRow.vue";
import { createTemplateContext, hasTemplateVariables, processTemplate, TemplateContext } from "../utils/template";
import { FileContext, useFileContext } from "./filecontext";
import { VueMarkdown } from "./VueMarkdown";
import { HealthMarkdown } from "./HealthView";

function formatBadgeValue(v: unknown): string {
  if (v == null) {
    return "";
  }
  if (Array.isArray(v)) {
    return v.map((x) => String(x)).join(", ");
  }
  return String(v);
}

function hasBadgeTemplates(items: Array<Record<string, unknown>>): boolean {
  return items.some(
    (item) =>
      (typeof item.label === "string" && hasTemplateVariables(item.label)) ||
      (typeof item.sublabel === "string" && hasTemplateVariables(item.sublabel)) ||
      (typeof item.value === "string" && hasTemplateVariables(item.value)) ||
      (Array.isArray(item.value) && item.value.some((x) => hasTemplateVariables(String(x))))
  );
}

function buildBadgesBlock(
  badgesRoot: { items?: unknown; dense?: unknown; grid?: { columns?: unknown } } | null | undefined,
  containerEl: HTMLElement,
  fileContext: FileContext
): { block: BadgesBlock; isTemplate: boolean } {
  const itemsRaw = Array.isArray(badgesRoot?.items) ? badgesRoot!.items! : [];
  const items = itemsRaw as Array<Record<string, unknown>>;

  const isTemplate = hasBadgeTemplates(items);
  const templateContext: TemplateContext | null = isTemplate
    ? createTemplateContext(containerEl, fileContext)
    : null;

  const gridColumns = badgesRoot?.grid;
  const columns = gridColumns && typeof gridColumns.columns === "number" ? gridColumns.columns : undefined;

  const badgesBlock: BadgesBlock = {
    items: items.map((item: Partial<BadgeItem> & { value?: unknown; label?: unknown; sublabel?: unknown }) => {
      let label = String(item.label ?? "");
      let value = formatBadgeValue(item.value);
      let sublabel = String(item.sublabel ?? "");

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
    dense: Boolean(badgesRoot?.dense),
    grid: { columns },
  };

  return { block: badgesBlock, isTemplate };
}

class CharacterHeroPanel extends MarkdownRenderChild {
  private source: string;
  private app: App;
  private kv: KeyValueStore;
  private filePath: string;
  private mdCtx: MarkdownPostProcessorContext;
  private baseView: BaseView;
  private fileContext: FileContext;
  private blobUrl: string | null = null;
  private unsubs: Array<() => void> = [];

  constructor(
    el: HTMLElement,
    source: string,
    app: App,
    kv: KeyValueStore,
    filePath: string,
    mdCtx: MarkdownPostProcessorContext,
    baseView: BaseView
  ) {
    super(el);
    this.source = source;
    this.app = app;
    this.kv = kv;
    this.filePath = filePath;
    this.mdCtx = mdCtx;
    this.baseView = baseView;
    this.fileContext = useFileContext(baseView.app, mdCtx);
  }

  async onload() {
    const root = this.containerEl;
    root.addClass("dnd-ui-character-hero");

    const parsed = parse(this.source) as {
      heading?: string;
      portrait?: string;
      badges?: { items?: unknown; dense?: unknown; grid?: { columns?: unknown } } | string;
      healthpoints?: string | Record<string, unknown>;
    };

    const heading = String(parsed.heading || "");
    const headingRow = root.createDiv({ cls: "dnd-ui-character-hero-heading" });
    let headText = heading;
    if (hasTemplateVariables(heading)) {
      const tc = createTemplateContext(this.containerEl, this.fileContext);
      headText = processTemplate(heading, tc);
    }
    headingRow.setText(headText);

    const badgesHost = root.createDiv({ cls: "dnd-ui-character-hero-badges" });

    const body = root.createDiv({ cls: "dnd-ui-character-hero-body" });
    const left = body.createDiv({ cls: "dnd-ui-character-hero-portrait" });
    const healthHost = body.createDiv({ cls: "dnd-ui-character-hero-health" });

    const portrait = String(parsed.portrait || "").trim();
    if (portrait) {
      if (/^https?:\/\//i.test(portrait)) {
        left.createEl("img", { attr: { src: portrait, alt: "Portrait" } });
      } else {
        const clean = portrait.replace(/^\[\[|\]\]$/g, "");
        const linked = this.app.metadataCache.getFirstLinkpathDest(clean, this.filePath);
        const f = (linked as TFile | null) || (this.app.vault.getAbstractFileByPath(normalizePath(clean)) as TFile);
        if (f instanceof TFile) {
          try {
            const ab = await this.app.vault.readBinary(f);
            const ext = f.extension.toLowerCase();
            const type =
              ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif" || ext === "webp"
                ? `image/${ext === "jpg" ? "jpeg" : ext}`
                : "image/png";
            const blob = new Blob([ab], { type });
            this.blobUrl = URL.createObjectURL(blob);
            left.createEl("img", { attr: { src: this.blobUrl, alt: f.basename } });
          } catch (e) {
            console.error("Failed to load portrait image", e);
            left.createEl("div", { cls: "dnd-ui-character-hero-missing", text: "Image load error" });
          }
        } else {
          left.createEl("div", { cls: "dnd-ui-character-hero-missing", text: "Image not found" });
        }
      }
    }

    let badgesData: { items?: unknown; dense?: unknown; grid?: { columns?: unknown } } | null = null;
    if (typeof parsed.badges === "string") {
      badgesData = (parse(parsed.badges) as { items?: unknown }) || {};
    } else if (parsed.badges && typeof parsed.badges === "object") {
      badgesData = parsed.badges;
    }

    if (badgesData && Array.isArray(badgesData.items) && badgesData.items.length) {
      const { block, isTemplate } = buildBadgesBlock(
        badgesData,
        this.containerEl,
        this.fileContext
      );
      const badgesVm = new VueMarkdown(badgesHost);
      badgesVm.mount(BadgesRow, { data: block });
      this.addChild(badgesVm);

      if (isTemplate) {
        const rerender = () => {
          const next = buildBadgesBlock(
            badgesData!,
            this.containerEl,
            this.fileContext
          );
          badgesVm.mount(BadgesRow, { data: next.block });
        };
        this.unsubs.push(
          this.fileContext.onFrontmatterChange(() => {
            rerender();
            const t = hasTemplateVariables(heading) ? processTemplate(heading, createTemplateContext(this.containerEl, this.fileContext)) : heading;
            headingRow.setText(t);
          })
        );
        this.unsubs.push(this.fileContext.onAbilitiesChange(rerender));
      } else if (hasTemplateVariables(heading)) {
        this.unsubs.push(
          this.fileContext.onFrontmatterChange(() => {
            const t = processTemplate(heading, createTemplateContext(this.containerEl, this.fileContext));
            headingRow.setText(t);
          })
        );
      }
    } else if (hasTemplateVariables(heading)) {
      this.unsubs.push(
        this.fileContext.onFrontmatterChange(() => {
          const t = processTemplate(heading, createTemplateContext(this.containerEl, this.fileContext));
          headingRow.setText(t);
        })
      );
    }

    if (parsed.healthpoints == null) {
      return;
    }
    const healthStr =
      typeof parsed.healthpoints === "string" ? parsed.healthpoints : stringify(parsed.healthpoints);
    if (!String(healthStr).trim()) {
      return;
    }
    const healthMd = new HealthMarkdown(healthHost, healthStr, this.kv, this.filePath, this.mdCtx, this.baseView);
    this.addChild(healthMd);
  }

  onunload() {
    for (const u of this.unsubs) {
      try {
        u();
      } catch {
        /* empty */
      }
    }
    this.unsubs = [];
    if (this.blobUrl) {
      try {
        URL.revokeObjectURL(this.blobUrl);
      } catch {
        /* empty */
      }
      this.blobUrl = null;
    }
  }
}

export class CharacterHeroView extends BaseView {
  public codeblock = "character-hero";
  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const panel = new CharacterHeroPanel(el, source, this.app, this.kv, ctx.sourcePath, ctx, this);
    ctx.addChild(panel);
  }
}
