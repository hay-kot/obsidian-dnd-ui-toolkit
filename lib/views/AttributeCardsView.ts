import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import AttributeCards from "../components/AttributeCards.vue";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import { readPathValue } from "../attributeCardStateRef";
import { KeyValueStore } from "lib/services/kv/kv";
import type { AttributeCardCell, AttributeCardsBlock, AttributeRealm } from "lib/types";
import { createTemplateContext, hasTemplateVariables, processTemplate, type TemplateContext } from "../utils/template";
import { FileContext, useFileContext } from "./filecontext";

function mapCell(item: any): AttributeCardCell {
  return {
    label: String(item?.label ?? ""),
    label_short: item?.label_short != null ? String(item.label_short) : undefined,
    header_value: item?.header_value,
    value: item?.value ?? "",
    value_state:
      item?.value_state &&
      typeof item.value_state.state_key === "string" &&
      typeof item.value_state.path === "string"
        ? {
            state_key: String(item.value_state.state_key),
            path: String(item.value_state.path),
            fallback: item.value_state.fallback,
          }
        : undefined,
    sublabel: item?.sublabel != null ? String(item.sublabel) : undefined,
  };
}

function mapRealm(r: any): AttributeRealm {
  return {
    label: String(r?.label ?? ""),
    primary: mapCell(r?.primary ?? {}),
    defense: mapCell(r?.defense ?? {}),
    secondary: mapCell(r?.secondary ?? {}),
    resources: Array.isArray(r?.resources) ? r.resources.map((x: any) => mapCell(x)) : [],
  };
}

function hasTemplateCell(cell: AttributeCardCell): boolean {
  return (
    hasTemplateVariables(cell.label) ||
    (typeof cell.label_short === "string" && hasTemplateVariables(cell.label_short)) ||
    (typeof cell.header_value === "string" && hasTemplateVariables(cell.header_value)) ||
    (typeof cell.value === "string" && hasTemplateVariables(cell.value)) ||
    (typeof cell.sublabel === "string" && hasTemplateVariables(cell.sublabel))
  );
}

function hasTemplates(data: AttributeCardsBlock): boolean {
  return (
    (typeof data.heading === "string" && hasTemplateVariables(data.heading)) ||
    data.realms.some(
      (realm) =>
        hasTemplateVariables(realm.label) ||
        hasTemplateCell(realm.primary) ||
        hasTemplateCell(realm.defense) ||
        hasTemplateCell(realm.secondary) ||
        realm.resources.some((cell) => hasTemplateCell(cell))
    )
  );
}

function applyTemplateValue(v: string | number | undefined, context: TemplateContext): string | number | undefined {
  if (typeof v !== "string" || !hasTemplateVariables(v)) {
    return v;
  }
  return processTemplate(v, context);
}

function resolveTemplateCell(cell: AttributeCardCell, context: TemplateContext): AttributeCardCell {
  return {
    ...cell,
    label: processTemplate(cell.label, context),
    label_short: applyTemplateValue(cell.label_short, context) as string | undefined,
    header_value: applyTemplateValue(cell.header_value, context),
    value: applyTemplateValue(cell.value, context) ?? "",
    sublabel: applyTemplateValue(cell.sublabel, context) as string | undefined,
  };
}

class AttributeCardsMarkdown extends VueMarkdown {
  private source: string;
  private fileContext: FileContext;
  private kv: KeyValueStore;
  private isTemplate = false;

  constructor(el: HTMLElement, source: string, app: App, ctx: MarkdownPostProcessorContext, kv: KeyValueStore) {
    super(el);
    this.source = source;
    this.fileContext = useFileContext(app, ctx);
    this.kv = kv;
  }

  async onload() {
    await this.processAndRender();
    this.setupListeners();
  }

  private setupListeners() {
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        if (!this.isTemplate) return;
        void this.processAndRender();
      })
    );
    this.addUnloadFn(
      this.fileContext.onAbilitiesChange(() => {
        if (!this.isTemplate) return;
        void this.processAndRender();
      })
    );
  }

  private async resolveCell(
    cell: AttributeCardCell,
    stateCache: Map<string, unknown>
  ): Promise<AttributeCardCell> {
    if (!cell.value_state?.state_key || !cell.value_state?.path) {
      return cell;
    }

    const key = cell.value_state.state_key;
    if (!stateCache.has(key)) {
      const state = await this.kv.get<unknown>(key);
      stateCache.set(key, state);
    }

    const state = stateCache.get(key);
    const raw = readPathValue(state, cell.value_state.path);
    const fallback = cell.value_state.fallback ?? cell.value;
    const value =
      typeof raw === "number" || typeof raw === "string"
        ? raw
        : typeof fallback === "number" || typeof fallback === "string"
          ? fallback
          : cell.value;

    return { ...cell, value };
  }

  private async resolveStateRefs(data: AttributeCardsBlock): Promise<AttributeCardsBlock> {
    const cache = new Map<string, unknown>();
    const realms = await Promise.all(
      data.realms.map(async (realm) => ({
        ...realm,
        primary: await this.resolveCell(realm.primary, cache),
        defense: await this.resolveCell(realm.defense, cache),
        secondary: await this.resolveCell(realm.secondary, cache),
        resources: await Promise.all(realm.resources.map(async (r) => this.resolveCell(r, cache))),
      }))
    );
    return { ...data, realms };
  }

  private resolveTemplates(data: AttributeCardsBlock): AttributeCardsBlock {
    const context = createTemplateContext(this.containerEl, this.fileContext);
    return {
      heading:
        typeof data.heading === "string" && hasTemplateVariables(data.heading)
          ? processTemplate(data.heading, context)
          : data.heading,
      realms: data.realms.map((realm) => ({
        ...realm,
        label: hasTemplateVariables(realm.label) ? processTemplate(realm.label, context) : realm.label,
        primary: resolveTemplateCell(realm.primary, context),
        defense: resolveTemplateCell(realm.defense, context),
        secondary: resolveTemplateCell(realm.secondary, context),
        resources: realm.resources.map((cell) => resolveTemplateCell(cell, context)),
      })),
    };
  }

  private async processAndRender() {
    const parsed = parse(this.source) as Record<string, unknown> | null;
    const realmsRaw = parsed && Array.isArray(parsed["realms"]) ? (parsed["realms"] as unknown[]) : [];
    const unresolvedData: AttributeCardsBlock = {
      heading: typeof parsed?.heading === "string" ? parsed.heading : undefined,
      realms: realmsRaw.map((r) => mapRealm(r)),
    };

    let resolved = await this.resolveStateRefs(unresolvedData);
    this.isTemplate = hasTemplates(resolved);
    if (this.isTemplate) {
      resolved = this.resolveTemplates(resolved);
    }
    this.mount(AttributeCards, { data: resolved });
  }
}

export class AttributeCardsView extends BaseView {
  public codeblock = "attribute-cards";
  private kv: KeyValueStore;

  constructor(app: App, kv: KeyValueStore) {
    super(app);
    this.kv = kv;
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const child = new AttributeCardsMarkdown(el, source, this.app, ctx, this.kv);
    ctx.addChild(child);
  }
}
