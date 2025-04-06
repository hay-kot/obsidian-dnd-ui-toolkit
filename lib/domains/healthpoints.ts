import * as Utils from "lib/utils/utils";
import { HealthBlock } from "lib/types";
import { parse } from "yaml";

export interface HealthState {
	current: number;
	temporary: number;
	hitdiceUsed: number;
}

export function parseHealthBlock(yamlString: string): HealthBlock & { state_key?: string } {
	const def: HealthBlock = {
		health: 6,
		hitdice: {
			dice: "d6",
			value: 1,
		},
	}

	const parsed = parse(yamlString);
	return Utils.mergeWithDefaults(parsed, def);
}

export function getDefaultHealthState(block: HealthBlock): HealthState {
	return {
		current: block.health,
		temporary: 0,
		hitdiceUsed: 0,
	};
}
