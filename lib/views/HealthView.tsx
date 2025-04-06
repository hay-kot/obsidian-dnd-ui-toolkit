import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as HealthService from "lib/domains/healthpoints";
import { HealthCard } from "lib/components/health-card";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { KeyValueStore } from "lib/kv";
import { HealthState } from "lib/domains/healthpoints";

export class HealthView extends BaseView {
	public codeblock = "healthpoints";

	private kv: KeyValueStore;

	constructor(kv: KeyValueStore) {
		super();
		this.kv = kv;
	}

	public render(source: string, el: HTMLElement, _: MarkdownPostProcessorContext): void {
		const healthBlock = HealthService.parseHealthBlock(source);

		const stateKey = healthBlock.state_key;
		if (!stateKey) {
			throw new Error("Health block must contain a 'state_key' property.");
		}

		// Initialize with default values
		const defaultState = HealthService.getDefaultHealthState(healthBlock);

		// Handler for state changes
		const handleStateChange = async (newState: HealthState) => {
			try {
				// Update state in KV store
				await this.kv.set(stateKey, newState);

				// Rerender component with new state
				renderComponent(newState);
			} catch (error) {
				console.error("Error saving health state:", error);
			}
		};

		// Function to render component with current state
		const renderComponent = (state: HealthState) => {
			const data = {
				static: healthBlock,
				state: state,
				onStateChange: handleStateChange,
			};

			// Render the React component
			const root = ReactDOM.createRoot(el);
			root.render(React.createElement(HealthCard, data));
		};

		// Load the initial state
		this.kv.get<HealthState>(stateKey).then(savedState => {
			const healthState = savedState || defaultState;

			// If no saved state exists, save the default state
			if (!savedState) {
				this.kv.set(stateKey, defaultState).catch(error => {
					console.error("Error saving initial health state:", error);
				});
			}

			// Render with the state we have
			renderComponent(healthState);
		}).catch(error => {
			console.error("Error loading health state:", error);
			// Fallback to default state if there's an error
			renderComponent(defaultState);
		});
	}
}
