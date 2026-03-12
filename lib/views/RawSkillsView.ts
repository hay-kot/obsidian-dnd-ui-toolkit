import { BaseView } from "./BaseView";
import SkillCards from "../components/SkillCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import type { SkillItem } from "lib/types";
import { hasTemplateVariables, processTemplate } from "../utils/template";
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

    const templateContext = this.detectTemplates(
      rawItems.flatMap((item: any) => [
        String(item.label || ""),
        String(item.ability || ""),
        String(item.modifier ?? ""),
      ])
    );

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
}
