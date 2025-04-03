import * as Tmpl from "lib/html-templates"
import * as Components from "lib/components"
import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities"

export class AbilityScoreView extends BaseView {
	public codeblock = "ability";

	public render(source: string, __: HTMLElement, _: MarkdownPostProcessorContext): string {
		const abilityBlock = AbilityService.parseAbilityBlock(source);
		return Tmpl.Render(Components.AbilityView(abilityBlock));
	}
}

