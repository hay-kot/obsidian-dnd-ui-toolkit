import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import SkillCards from "../components/SkillCards.vue";
import { parseSkillRank, rankFromProficiencyString } from "../skillCardRank";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import type { SkillItem, SkillRealmConfig } from "lib/types";
import { createTemplateContext, hasTemplateVariables, processTemplate } from "lib/utils/template";
import { FileContext, useFileContext } from "./filecontext";

type ParsedRawSkills = {
  items?: any[];
  realms?: Array<{ id?: unknown; label?: unknown; skills?: unknown }>;
};

function toTemplateString(input: unknown): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const entries = Object.entries(input as Record<string, unknown>);
    if (entries.length === 1 && entries[0][1] == null) {
      const key = entries[0][0].trim();
      const inner = key.replace(/^\{\s*/, "").replace(/\s*\}$/, "");
      return `{{ ${inner} }}`;
    }
  }
  return null;
}

class RawSkillsMarkdown extends VueMarkdown {
  private source: string;
  private fileContext: FileContext;
  private hasTemplates = false;

  constructor(el: HTMLElement, source: string, app: App, ctx: MarkdownPostProcessorContext) {
    super(el);
    this.source = source;
    this.fileContext = useFileContext(app, ctx);
  }

  onload() {
    this.processAndRender();
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        if (!this.hasTemplates) return;
        this.processAndRender();
      })
    );
    this.addUnloadFn(
      this.fileContext.onAbilitiesChange(() => {
        if (!this.hasTemplates) return;
        this.processAndRender();
      })
    );
  }

  private processAndRender() {
    const parsed = parse(this.source) as ParsedRawSkills | undefined;
    const baseTemplateContext = createTemplateContext(this.containerEl, this.fileContext);

    const realms: SkillRealmConfig[] = Array.isArray(parsed?.realms)
      ? parsed.realms
          .filter((r) => r && typeof r.id === "string" && r.id.trim().length > 0)
          .map((r) => ({
            id: String(r.id).trim().toLowerCase(),
            label: typeof r.label === "string" ? r.label : undefined,
            skills: Array.isArray(r.skills)
              ? r.skills.map((x) => String(x).trim().toLowerCase()).filter(Boolean)
              : [],
          }))
      : [];

    const items: SkillItem[] = (parsed?.items || []).map((item: any) => {
      const isProficient = item.proficiency === "proficient";
      const isExpert = item.proficiency === "expert";
      const isHalfProficient = item.proficiency === "half";
      const fromYaml = parseSkillRank(item.rank);
      const rank = fromYaml !== undefined ? fromYaml : rankFromProficiencyString(item.proficiency);

      const contextWithRank = {
        ...baseTemplateContext,
        rank,
      };
      const labelSource = toTemplateString(item.label) ?? String(item.label || "");
      const abilitySource = toTemplateString(item.ability) ?? String(item.ability || "");
      const modifierTemplate = toTemplateString(item.modifier);
      const modifierSource = modifierTemplate ?? item.modifier;

      let label = String(labelSource || "");
      let ability = String(abilitySource || "");
      let modifierValue: number = typeof modifierSource === "number" ? modifierSource : 0;

      if (typeof labelSource === "string" && hasTemplateVariables(labelSource)) {
        label = processTemplate(labelSource, contextWithRank as any);
      }
      if (typeof abilitySource === "string" && hasTemplateVariables(abilitySource)) {
        ability = processTemplate(abilitySource, contextWithRank as any);
      }
      if (typeof modifierSource === "string" && hasTemplateVariables(modifierSource)) {
        const resolved = processTemplate(modifierSource, contextWithRank as any);
        const parsedModifier = parseInt(resolved, 10);
        modifierValue = Number.isNaN(parsedModifier) ? 0 : parsedModifier;
      }
      if (typeof modifierSource === "string" && !hasTemplateVariables(modifierSource)) {
        const parsedModifier = parseInt(modifierSource, 10);
        modifierValue = Number.isNaN(parsedModifier) ? 0 : parsedModifier;
      }

      return {
        label,
        ability,
        modifier: modifierValue ?? 0,
        isProficient,
        isExpert,
        isHalfProficient,
        rank,
        realm: item.realm != null ? String(item.realm).trim().toLowerCase() : undefined,
      };
    });

    this.hasTemplates =
      hasTemplateVariables(this.source) ||
      items.some((item) => typeof item.modifier === "string" && hasTemplateVariables(item.modifier));

    this.mount(SkillCards, { items, realms });
  }
}

export class RawSkillsView extends BaseView {
  public codeblock = "skill-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const child = new RawSkillsMarkdown(el, source, this.app, ctx);
    ctx.addChild(child);
  }
}
