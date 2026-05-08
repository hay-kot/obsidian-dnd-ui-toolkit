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

class RawSkillsComponent extends TemplateAwareComponent {
  protected processAndRender() {
    const parsed = this.parseSource();
    const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];

    const sources = rawItems.map((item: any) => ({
      label: String(item.label ?? ""),
      ability: String(item.ability ?? ""),
      modifier: String(item.modifier ?? ""),
      proficiency: item.proficiency,
    }));

    const templateContext = this.setupTemplates(
      sources.flatMap((s: { label: string; ability: string; modifier: string }) => [s.label, s.ability, s.modifier])
    );

    const items: SkillItem[] = sources.map(
      (s: { label: string; ability: string; modifier: string; proficiency: string }) => {
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
      }
    );

    this.mount(SkillCards, { items });
  }
}
