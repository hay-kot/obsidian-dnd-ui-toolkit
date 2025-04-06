import * as Utils from "lib/utils/utils";
import { HealthBlock } from "lib/types";
import { parse } from "yaml";

export function parseHealthBlock(yamlString: string): HealthBlock {
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
