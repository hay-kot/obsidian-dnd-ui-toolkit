import * as Tmpl from "lib/html-templates"
import { BaseView } from "./BaseView";
import { BadgesRow } from "../components/badges";
import { MarkdownPostProcessorContext } from "obsidian";
import { BadgeItem, BadgesBlock } from "lib/types";
import { parse } from 'yaml';

export class BadgesView extends BaseView {
	public codeblock = "badges";

	public render(source: string, __: HTMLElement, _: MarkdownPostProcessorContext): string {
		const parsed = parse(source);
		const items = Array.isArray(parsed.items) ? parsed.items : [];

		const badgesBlock: BadgesBlock = {
			items: items.map((item: Partial<BadgeItem>) => ({
				reverse: Boolean(item.reverse),
				label: String(item.label || ''),
				value: String(item.value || '')
			}))
		};

		return Tmpl.Render(BadgesRow({ data: badgesBlock }));
	}
}
