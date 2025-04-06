import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import { HealthCard } from "lib/components/health-card";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { KeyValueStore } from "lib/kv";
import { HealthState } from "lib/domains/healthpoints";
import { HealthBlock } from "lib/types";

export class HealthView extends BaseView {
	public codeblock = "healthpoints";

	private kv: KeyValueStore;

	constructor(kv: KeyValueStore) {
		super();
		this.kv = kv;
	}

	public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
		const healthMarkdown = new HealthMarkdown(el, source, this.kv);
		ctx.addChild(healthMarkdown);
	}
}

class HealthMarkdown extends MarkdownRenderChild {
	private reactRoot: ReactDOM.Root | null = null;
	private source: string;
	private kv: KeyValueStore;

	constructor(el: HTMLElement, source: string, kv: KeyValueStore) {
		super(el);
		this.source = source;
		this.kv = kv;
	}

	async onload() {
		const healthBlock = HealthService.parseHealthBlock(this.source);

		const stateKey = healthBlock.state_key;
		if (!stateKey) {
			throw new Error("Health block must contain a 'state_key' property.");
		}

		// Initialize with default values
		const defaultState = HealthService.getDefaultHealthState(healthBlock);

		try {
			// Load the initial state
			const savedState = await this.kv.get<HealthState>(stateKey);
			const healthState = savedState || defaultState;

			// If no saved state exists, save the default state
			if (!savedState) {
				try {
					await this.kv.set(stateKey, defaultState);
				} catch (error) {
					console.error("Error saving initial health state:", error);
				}
			}

			// Render with the state we have
			this.renderComponent(healthBlock, healthState);
		} catch (error) {
			console.error("Error loading health state:", error);
			// Fallback to default state if there's an error
			this.renderComponent(healthBlock, defaultState);
		}
	}

	private renderComponent(healthBlock: HealthBlock, state: HealthState) {
		const stateKey = healthBlock.state_key;
		if (!stateKey) return;

		const data = {
			static: healthBlock,
			state: state,
			onStateChange: (newState: HealthState) => {
				// Update the state first
				this.handleStateChange(healthBlock, newState);

				// Re-render with the new state
				this.renderComponent(healthBlock, newState);
			},
		};

		// Create or reuse a React root
		if (!this.reactRoot) {
			this.reactRoot = ReactDOM.createRoot(this.containerEl);
		}

		this.reactRoot.render(React.createElement(HealthCard, data));
	}

	private async handleStateChange(healthBlock: HealthBlock, newState: HealthState) {
		const stateKey = healthBlock.state_key;
		if (!stateKey) return;

		try {
			// Update state in KV store
			await this.kv.set(stateKey, newState);
		} catch (error) {
			console.error(`Error saving health state for ${stateKey}:`, error);
		}
	}

	onunload() {
		// Clean up React root to prevent memory leaks
		if (this.reactRoot) {
			try {
				this.reactRoot.unmount();
			} catch (e) {
				console.error('Error unmounting React component:', e);
			}
			this.reactRoot = null;
			console.debug('Unmounted React component in HealthMarkdown');
		}
	}
}
