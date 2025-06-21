import * as Tmpl from "lib/html-templates";
import { BaseView } from "./BaseView";
import { SpellComponents } from "../components/spell-components";
import { MarkdownPostProcessorContext } from "obsidian";
import { SpellComponentsBlock } from "lib/types";
import { parse } from "yaml";

export class SpellComponentsView extends BaseView {
  public codeblock = "spell-components";

  public render(source: string, __: HTMLElement, _: MarkdownPostProcessorContext): string {
    const parsed = parse(source);

    const spellComponentsBlock: SpellComponentsBlock = {
      casting_time: parsed.casting_time || parsed.castingTime,
      range: parsed.range,
      components: parsed.components,
      duration: parsed.duration,
    };

    return Tmpl.Render(SpellComponents({ data: spellComponentsBlock }));
  }
}
