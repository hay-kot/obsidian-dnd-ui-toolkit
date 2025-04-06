import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as ConsumableService from "lib/domains/consumables";
import { ConsumableCheckboxes } from "lib/components/consumable-checkboxes";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { KeyValueStore } from "lib/kv";
import { ConsumableState } from "lib/domains/consumables";

export class ConsumableView extends BaseView {
	public codeblock = "consumable";

	private kv: KeyValueStore;

	constructor(kv: KeyValueStore) {
		super();
		this.kv = kv;
	}

	public render(source: string, el: HTMLElement, _: MarkdownPostProcessorContext): void {
		const consumablesBlock = ConsumableService.parseConsumablesBlock(source);

		// Create a container for all consumables
		const consumablesContainer = document.createElement('div');
		consumablesContainer.className = 'consumables-column';
		el.appendChild(consumablesContainer);

		// Find the longest label to calculate proper alignment
		let maxLabelLength = 0;
		consumablesBlock.items.forEach(item => {
			if (item.label && item.label.length > maxLabelLength) {
				maxLabelLength = item.label.length;
			}
		});

		// Apply the calculated width to a CSS variable
		const labelWidthEm = Math.max(3, maxLabelLength * 0.55); // Adjust multiplier based on font size
		consumablesContainer.style.setProperty('--consumable-label-width', `${labelWidthEm}em`);

		// Process each consumable item
		consumablesBlock.items.forEach((consumableBlock, index) => {
			const itemContainer = document.createElement('div');
			itemContainer.className = 'consumable-item';
			consumablesContainer.appendChild(itemContainer);

			const stateKey = consumableBlock.state_key;
			if (!stateKey) {
				throw new Error(`Consumable item at index ${index} must contain a 'state_key' property.`);
			}

			// Initialize with default values
			const defaultState = ConsumableService.getDefaultConsumableState(consumableBlock);

			// Handler for state changes
			const handleStateChange = async (newState: ConsumableState) => {
				try {
					// Update state in KV store
					await this.kv.set(stateKey, newState);

					// Rerender component with new state
					renderComponent(newState);
				} catch (error) {
					console.error(`Error saving consumable state for ${stateKey}:`, error);
				}
			};

			// Function to render component with current state
			const renderComponent = (state: ConsumableState) => {
				const data = {
					static: consumableBlock,
					state: state,
					onStateChange: handleStateChange,
				};

				// Render the React component
				const root = ReactDOM.createRoot(itemContainer);
				root.render(React.createElement(ConsumableCheckboxes, data));
			};

			// Load the initial state
			this.kv.get<ConsumableState>(stateKey).then(savedState => {
				const consumableState = savedState || defaultState;

				// If no saved state exists, save the default state
				if (!savedState) {
					this.kv.set(stateKey, defaultState).catch(error => {
						console.error(`Error saving initial consumable state for ${stateKey}:`, error);
					});
				}

				// Render with the state we have
				renderComponent(consumableState);
			}).catch(error => {
				console.error(`Error loading consumable state for ${stateKey}:`, error);
				// Fallback to default state if there's an error
				renderComponent(defaultState);
			});
		});
	}
}
