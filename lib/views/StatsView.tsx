import * as Tmpl from "lib/html-templates"
import { BaseView } from "./BaseView";
import { StatsGridItems } from "../components/stat-cards";
import { MarkdownPostProcessorContext } from "obsidian";
import { StatItem, StatsBlock } from "lib/types";
import { parse } from 'yaml';

export class StatsView extends BaseView {
	public codeblock = "stats";

	public render(source: string, __: HTMLElement, _: MarkdownPostProcessorContext): string {
		const parsed = parse(source);
		const items = Array.isArray(parsed.items) ? parsed.items : [];
		const grid = parsed.grid || {};

		const statsBlock: StatsBlock = {
			items: items.map((item: Partial<StatItem>) => ({
				label: String(item.label || ''),
				value: item.value !== undefined ? item.value : '',
				sublabel: item.sublabel !== undefined ? String(item.sublabel) : undefined
			})),
			grid: {
				columns: typeof grid.columns === 'number' ? grid.columns : undefined
			}
		};

		return Tmpl.Render(StatsGridItems(statsBlock));
	}
}
