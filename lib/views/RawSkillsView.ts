import { BaseView } from "./BaseView";
import SkillCards from "../components/SkillCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import type { SkillItem } from "lib/types";
import { coerceNumericTemplate, processTemplate } from "../utils/template";
import { TemplateAwareComponent } from "./TemplateAwareComponent";

export class RawSkillsView extends BaseView {
  public codeblock = "skill-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new RawSkillsComponent(el, source, this.app, ctx);
    ctx.addChild(cmp);
  }
}

// YAML scalars, not yet coerced — a user may write any of these as a number.
type RawSkillCardItem = {
  label?: string | number;
  ability?: string | number;
  modifier?: string | number;
  proficiency?: string;
};

class RawSkillsComponent extends TemplateAwareComponent {
  protected processAndRender() {
    const parsed = this.parseSource<{ items: RawSkillCardItem[] }>();
    const rawItems = Array.isArray(parsed.items) ? parsed.items : [];

    const sources = rawItems.map((item) => ({
      label: String(item.label ?? ""),
      ability: String(item.ability ?? ""),
      modifier: String(item.modifier ?? ""),
      proficiency: item.proficiency,
    }));

    const templateContext = this.setupTemplates(sources.flatMap((s) => [s.label, s.ability, s.modifier]));

    const items: SkillItem[] = sources.map((s) => {
      const label = templateContext ? processTemplate(s.label, templateContext) : s.label;
      const ability = templateContext ? processTemplate(s.ability, templateContext) : s.ability;
      const modifierStr = templateContext ? processTemplate(s.modifier, templateContext) : s.modifier;

      return {
        label,
        ability,
        modifier: coerceNumericTemplate(modifierStr, s.modifier),
        isProficient: s.proficiency === "proficient",
        isExpert: s.proficiency === "expert",
        isHalfProficient: s.proficiency === "half",
      };
    });

    this.mount(SkillCards, { items });
  }
}
