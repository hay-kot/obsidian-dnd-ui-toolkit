import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Tmpl from "lib/html-templates";
import { SavingThrowsComponent } from "lib/components";
import { AbilityScores, SavingThrowsBlock } from "lib/types";
import { parseSavingThrowsBlock } from "lib/domains/saving-throws";
import { parseAbilityBlockFromDocument } from "lib/domains/abilities";

export class SavingThrowsView extends BaseView {
	public codeblock = "savingthrows";

	public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): string {
		const config = parseSavingThrowsBlock(source);
		const abilities = parseAbilityBlockFromDocument(el, ctx);

		const fm = this.frontmatter(ctx);
		console.log(fm)

		// Combine the parsed config with the found ability scores
		const savingThrowsData: SavingThrowsBlock = {
			proficiencyBonus: fm.proficiencyBonus || 2,
			abilityScores: abilities.abilities,
			proficiencies: (fm.proficiencies || []) as Array<keyof AbilityScores>,
			bonuses: config.bonuses,
		};

		return Tmpl.Render(
			<SavingThrowsComponent data={savingThrowsData} />
		);
	}
}
