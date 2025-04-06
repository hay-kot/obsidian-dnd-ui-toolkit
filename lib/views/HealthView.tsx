import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import { HealthCard } from "lib/components/health-card";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { KeyValueStore } from "lib/kv";

export class HealthView extends BaseView {
	public codeblock = "healthpoints";

	private kv: KeyValueStore

	constructor(kv: KeyValueStore) {
		super();
		this.kv = kv;
	}

	public render(source: string, el: HTMLElement, _: MarkdownPostProcessorContext): void {
		const healthBock = HealthService.parseHealthBlock(source);
		console.debug("Health Block", healthBock);

		const data = {
			static: healthBock,
			state: {
				current: 12,
				temporary: 10,
				hitdiceUsed: 2,
			},
		}

		ReactDOM.createRoot(el)
		// Render the React component
		const root = ReactDOM.createRoot(el);
		root.render(React.createElement(HealthCard, data));
		return
	}
}

