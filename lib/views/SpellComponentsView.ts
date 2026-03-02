import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import SpellComponents from "../components/SpellComponents.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import { SpellComponentsBlock } from "lib/types";
import { parse } from "yaml";

export class SpellComponentsView extends BaseView {
  public codeblock = "spell-components";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const parsed = parse(source);
    const data: SpellComponentsBlock = {
      casting_time: parsed.casting_time || parsed.castingTime,
      range: parsed.range,
      components: parsed.components,
      duration: parsed.duration,
    };

    const child = new VueMarkdown(el);
    child.mount(SpellComponents, { data });
    ctx.addChild(child);
  }
}
