import * as Utils from "lib/utils/utils";
import { ConsumableBlock } from "lib/types";
import { parse } from "yaml";

export interface ConsumableState {
	value: number;
}

export interface ConsumablesBlock {
	items: (ConsumableBlock & { state_key?: string })[];
}

export function parseConsumableBlock(yamlString: string): ConsumableBlock & { state_key?: string } {
	const def: ConsumableBlock = {
		label: "Consumable",
		// @ts-expect-error - no viable default for state_key
		state_key: undefined,
		uses: 3,
		reset_on: undefined,
	};

	const parsed = parse(yamlString);
	return Utils.mergeWithDefaults(parsed, def);
}

export function parseConsumablesBlock(yamlString: string): ConsumablesBlock {
	const parsed = parse(yamlString);

	// If the parsed data already has an 'items' array, use it
	if (parsed && Array.isArray(parsed.items)) {
		const defItem: ConsumableBlock = {
			label: "Consumable",
			// @ts-expect-error - no viable default for state_key
			state_key: undefined,
			uses: 3,
		};

		// Apply defaults to each item
		return {
			items: parsed.items.map((item: any) => Utils.mergeWithDefaults(item, defItem)),
		};
	}

	// Backward compatibility: if no items array, treat the whole object as a single consumable
	const singleConsumable = parseConsumableBlock(yamlString);
	return {
		items: [singleConsumable],
	};
}

export function getDefaultConsumableState(block: ConsumableBlock): ConsumableState {
	return {
		value: 0,
	};
}
