import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import SkillCards from "../components/SkillCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import type { SkillItem } from "lib/types";

export class RawSkillsView extends BaseView {
  public codeblock = "skill-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const parsed = parse(source);
    const items: SkillItem[] = (parsed?.items || []).map((item: any) => ({
      label: item.label || "",
      ability: item.ability || "",
      modifier: item.modifier ?? 0,
      isProficient: item.proficiency === "proficient",
      isExpert: item.proficiency === "expert",
      isHalfProficient: item.proficiency === "half",
    }));

    const child = new VueMarkdown(el);
    child.mount(SkillCards, { items });
    ctx.addChild(child);
  }
}
