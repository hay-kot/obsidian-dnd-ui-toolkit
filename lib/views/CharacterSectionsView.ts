import { App, MarkdownPostProcessorContext } from "obsidian";
import { parse } from "yaml";
import CharacterSections from "../components/CharacterSections.vue";
import type { CharacterSectionsBlock } from "../types";
import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";

export class CharacterSectionsView extends BaseView {
  public codeblock = "character-sections";

  constructor(app: App) {
    super(app);
  }

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const parsed = parse(source) as CharacterSectionsBlock;
    const cmp = new VueMarkdown(el);
    cmp.mount(CharacterSections, { data: parsed || {} });
    ctx.addChild(cmp);
  }
}
