import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import AbilityCards from "../components/AbilityCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";

export class RawAbilityView extends BaseView {
  public codeblock = "ability-cards";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const parsed = parse(source);
    const items = (parsed?.items || []).map((item: any) => ({
      label: item.label || "",
      labelShort: item.label_short || "",
      total: item.header_value || 0,
      modifier: item.value || "",
      isProficient: false,
      savingThrow: item.sublabel || "",
    }));

    const child = new VueMarkdown(el);
    child.mount(AbilityCards, { abilities: items, showSavingPrefix: false });
    ctx.addChild(child);
  }
}
