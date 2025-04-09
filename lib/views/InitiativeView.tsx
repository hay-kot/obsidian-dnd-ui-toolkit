import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import type { InitiativeState } from "lib/components/initiative";
import * as ReactDOM from 'react-dom/client';
import { KeyValueStore } from "lib/kv";
import { InitiativeBlock } from "lib/types";

export class InitiativeView extends BaseView {
	public codeblock = "initiative";

	private kv: KeyValueStore;

	constructor(kv: KeyValueStore) {
		super();
		this.kv = kv;
	}

	public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
		const consumableMarkdown = new InitiativeMarkdown(el, source, this.kv);
		ctx.addChild(consumableMarkdown);
	}
}

class InitiativeMarkdown extends MarkdownRenderChild {
	private reactRoots: Map<string, ReactDOM.Root> = new Map();
	private source: string;
	private kv: KeyValueStore;
	private consumablesContainer: HTMLElement;

	constructor(el: HTMLElement, source: string, kv: KeyValueStore) {
		super(el);
		this.source = source;
		this.kv = kv;
		this.consumablesContainer = document.createElement('div');
		el.appendChild(this.consumablesContainer);
	}

	async onload() {
	}

	private renderComponent(container: HTMLElement, block: InitiativeBlock, state: InitiativeState,) {
	}

	private async handleStateChange(consumableBlock: InitiativeBlock, newState: InitiativeState) {
	}

	onunload() {
		// Clean up all React roots to prevent memory leaks
		this.reactRoots.forEach(root => {
			try {
				root.unmount();
			} catch (e) {
				console.error('Error unmounting React component:', e);
			}
		});
		this.reactRoots.clear();
		console.debug('Unmounted all React components in ConsumableMarkdown');
	}
}
