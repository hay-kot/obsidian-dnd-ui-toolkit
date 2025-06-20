import * as Utils from "lib/utils/utils";
import { HealthBlock } from "lib/types";
import { parse } from "yaml";

export interface HealthState {
	current: number;
	temporary: number;
	hitdiceUsed: number;
	deathSaveSuccesses: number;
	deathSaveFailures: number;
}

export function parseHealthBlock(yamlString: string): HealthBlock & { state_key?: string } {
	const def: HealthBlock = {
		label: "Hit Points",
		// @ts-expect-error - no viable default for state_key
		state_key: undefined,
		health: 6,
		hitdice: undefined,
		death_saves: true
	}

	const parsed = parse(yamlString);
	return Utils.mergeWithDefaults(parsed, def);
}

export function getDefaultHealthState(block: HealthBlock): HealthState {
	return {
		current: block.health,
		temporary: 0,
		hitdiceUsed: 0,
		deathSaveSuccesses: 0,
		deathSaveFailures: 0,
	};
}
