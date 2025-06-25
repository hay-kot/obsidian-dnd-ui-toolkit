import * as Utils from "lib/utils/utils";
import { HealthBlock, ParsedHealthBlock } from "lib/types";
import { parse } from "yaml";
import { normalizeResetConfig } from "lib/domains/events";

export interface HealthState {
  current: number;
  temporary: number;
  hitdiceUsed: number;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
}

export function parseHealthBlock(yamlString: string): ParsedHealthBlock {
  const def: HealthBlock = {
    label: "Hit Points",
    // @ts-expect-error - no viable default for state_key
    state_key: undefined,
    health: 6,
    hitdice: undefined,
    death_saves: true,
    reset_on: "long-rest", // Default to long rest for health recovery
  };

  const parsed = parse(yamlString);
  const merged = Utils.mergeWithDefaults(parsed, def);
  
  // Normalize reset_on to always be an array of ResetConfig objects
  const normalized: ParsedHealthBlock = {
    ...merged,
    reset_on: normalizeResetConfig(merged.reset_on),
  };

  return normalized;
}

export function getDefaultHealthState(block: ParsedHealthBlock): HealthState {
  const healthValue = typeof block.health === "string" ? 6 : block.health; // Default fallback if health is still a string
  return {
    current: healthValue,
    temporary: 0,
    hitdiceUsed: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
  };
}
