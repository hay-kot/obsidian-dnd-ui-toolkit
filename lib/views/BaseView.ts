import { Frontmatter } from "lib/types";
import { MarkdownPostProcessorContext } from "obsidian";

const FrontMatterKeys: Record<keyof Frontmatter, string[]> = {
	"proficiencyBonus": ["proficiencyBonus", "Proficiency Bonus",],
	"proficiencies": ["Proficiencies", "Proficient"],
};

export abstract class BaseView {
	public abstract codeblock: string;

	// Changed return type from string to HTMLElement or void
	public abstract render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): HTMLElement | string | void;

	public register(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const div = el.createEl("div");
		try {
			const result = this.render(source, el, ctx);

			// Handle different return types from render
			if (result instanceof HTMLElement) {
				div.appendChild(result);
			} else if (typeof result === 'string') {
				div.innerHTML = result;
			} else {
				// If render returns void (modifies div directly)
				console.log("Rendering code block", this.codeblock);
			}
		} catch (e) {
			console.error("Error rendering code block", e);
			// Using a type assertion to handle the potential error type mismatch
			const errorMessage = e instanceof Error ? e.message : String(e);
			div.innerHTML = `<div class="notice">Error parsing stats block: ${errorMessage}</div>`;
		}
	}

	public frontmatter(ctx: MarkdownPostProcessorContext): Frontmatter {

		const frontmatter: Frontmatter = {
			proficiencyBonus: 2,
			proficiencies: [],
		}

		// @ts-ignore
		const fm = app.metadataCache.getCache(ctx.sourcePath).frontmatter
		for (const key in FrontMatterKeys) {
			const keys = FrontMatterKeys[key as keyof Frontmatter]

			for (const k of keys) {
				if (fm[k] !== undefined) {
					frontmatter[key as keyof Frontmatter] = fm[k];
					break;
				}

				const lowered = k.toLowerCase();
				if (fm[lowered] !== undefined) {
					frontmatter[key as keyof Frontmatter] = fm[lowered];
					break;
				}
			}
		}

		return frontmatter

	}
}
