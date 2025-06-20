import * as Tmpl from "lib/html-templates"
import { BaseView } from "./BaseView";
import { BadgesRow } from "../components/badges";
import { MarkdownPostProcessorContext } from "obsidian";
import { BadgeItem, BadgesBlock } from "lib/types";
import { parse } from 'yaml';
import { hasTemplateVariables, processTemplate, createTemplateContext, TemplateContext } from '../utils/template';

export class BadgesView extends BaseView {
	public codeblock = "badges";

	public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): string {
		const parsed = parse(source);
		const items = Array.isArray(parsed.items) ? parsed.items : [];

		// Check if any items contain template variables
		const hasTemplates = items.some((item: Partial<BadgeItem>) => 
			hasTemplateVariables(String(item.label || '')) || hasTemplateVariables(String(item.value || ''))
		);

		let templateContext: TemplateContext | null = null;
		if (hasTemplates) {
			templateContext = createTemplateContext(el, ctx, this);
		}

		const badgesBlock: BadgesBlock = {
			items: items.map((item: Partial<BadgeItem>) => {
				let label = String(item.label || '');
				let value = String(item.value || '');

				if (templateContext) {
					if (hasTemplateVariables(label)) {
						label = processTemplate(label, templateContext);
					}
					if (hasTemplateVariables(value)) {
						value = processTemplate(value, templateContext);
					}
				}

				return {
					reverse: Boolean(item.reverse),
					label,
					value
				};
			}),
			dense: Boolean(parsed.dense)
		};

		return Tmpl.Render(BadgesRow({ data: badgesBlock }));
	}
}
