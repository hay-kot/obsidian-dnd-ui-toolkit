import * as Utils from "lib/utils/utils";
import { InitiativeBlock, InitiativeItem } from "lib/types";
import { parse } from "yaml";

export interface InitiativeState {
	activeIndex: number;
	initiatives: Record<string, number>;
	hp: Record<string, Record<string, number>>;
	round: number;
}

export function parseInitiativeBlock(yamlString: string): InitiativeBlock & { state_key?: string } {
	const def: InitiativeBlock = {
		// @ts-expect-error - no viable default for state_key
		state_key: undefined,
		items: []
	};

	const parsed = parse(yamlString);
	return Utils.mergeWithDefaults(parsed, def);
}

export function getDefaultInitiativeState(block: InitiativeBlock): InitiativeState {
	const initiatives: Record<string, number> = {};
	const hp: Record<string, Record<string, number>> = {};

	// Initialize with default values (0 for initiative, max hp for health)
	block.items.forEach((item, index) => {
		initiatives[index.toString()] = 0;
		hp[index.toString()] = {};

		// If HP is provided as a number, use it as max HP for a single monster
		if (typeof item.hp === 'number') {
			hp[index.toString()]['main'] = item.hp;
		}

		// If HP is provided as a record, it's a group of monsters
		else if (item.hp && typeof item.hp === 'object') {
			Object.entries(item.hp).forEach(([key, value]) => {
				hp[index.toString()][key] = value as number;
			});
		}
	});

	return {
		activeIndex: -1, // No active combatant at first
		initiatives,
		hp,
		round: 1, // Start at round 1
	};
}

// Sort items by initiative value, higher values first
export function getSortedInitiativeItems(
	items: InitiativeItem[],
	initiativeValues: Record<string, number>
): { item: InitiativeItem; index: number; initiative: number }[] {
	return items
		.map((item, index) => ({
			item,
			index,
			initiative: initiativeValues[index.toString()] || 0
		}))
		.sort((a, b) => b.initiative - a.initiative);
}

// Check if an HP object is a group (has multiple keys)
export function isGroupHp(hp: Record<string, number>): boolean {
	return Object.keys(hp).length > 1 || (Object.keys(hp).length === 1 && Object.keys(hp)[0] !== 'main');
}

// Get the max HP for a specific monster
export function getMaxHp(item: InitiativeItem, monsterKey?: string): number {
	if (typeof item.hp === 'number') {
		return item.hp;
	} else if (item.hp && typeof item.hp === 'object') {
		if (monsterKey && monsterKey in item.hp) {
			return item.hp[monsterKey] as number;
		} else if (Object.keys(item.hp).length === 1) {
			return Object.values(item.hp)[0] as number;
		}
	}
	return 0;
}
