import * as Utils from "lib/utils/utils";
import { HealthBlock, ParsedHealthBlock } from "lib/types";
import { parse } from "yaml";
import { normalizeResetConfig } from "lib/domains/events";

export interface HealthState {
  current: number;
  temporary: number;
  hitdiceUsed: number | Record<string, number>; // Support both legacy number and new per-dice-type tracking
  deathSaveSuccesses: number;
  deathSaveFailures: number;
}

// Type guards for better type safety
export function isSingleHitDiceState(state: HealthState): state is HealthState & { hitdiceUsed: number } {
  return typeof state.hitdiceUsed === "number";
}

export function isMultiHitDiceState(
  state: HealthState
): state is HealthState & { hitdiceUsed: Record<string, number> } {
  return typeof state.hitdiceUsed === "object" && state.hitdiceUsed !== null;
}

export function hasSingleHitDice(block: ParsedHealthBlock): boolean {
  return block.hitdice !== undefined && block.hitdice.length === 1;
}

export function hasMultipleHitDice(block: ParsedHealthBlock): boolean {
  return block.hitdice !== undefined && block.hitdice.length > 1;
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

  // Normalize hitdice to always be an array
  let normalizedHitdice: ParsedHealthBlock["hitdice"] = undefined;
  if (merged.hitdice) {
    if (Array.isArray(merged.hitdice)) {
      normalizedHitdice = merged.hitdice;
    } else {
      // Convert single hit dice to array format
      normalizedHitdice = [merged.hitdice];
    }
  }

  // Normalize reset_on to always be an array of ResetConfig objects
  const normalized: ParsedHealthBlock = {
    ...merged,
    reset_on: normalizeResetConfig(merged.reset_on),
    hitdice: normalizedHitdice,
  };

  return normalized;
}

export function getDefaultHealthState(block: ParsedHealthBlock): HealthState {
  const healthValue = typeof block.health === "string" ? 6 : block.health; // Default fallback if health is still a string

  // Initialize hitdiceUsed based on whether we have multiple dice types
  let hitdiceUsed: number | Record<string, number> = 0;
  if (block.hitdice && block.hitdice.length > 1) {
    // Multiple dice types - initialize with a record
    hitdiceUsed = {};
    for (const hd of block.hitdice) {
      hitdiceUsed[hd.dice] = 0;
    }
  }

  return {
    current: healthValue,
    temporary: 0,
    hitdiceUsed,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
  };
}

// Helper function to migrate old state format to new format when needed
export function migrateHealthState(state: HealthState, block: ParsedHealthBlock): HealthState {
  // If we have multiple hit dice types but state is still using a number
  if (block.hitdice && block.hitdice.length > 1 && typeof state.hitdiceUsed === "number") {
    const newHitdiceUsed: Record<string, number> = {};

    // Initialize all dice types to 0
    for (const hd of block.hitdice) {
      newHitdiceUsed[hd.dice] = 0;
    }

    // Distribute the used dice across types proportionally
    let remainingUsed = state.hitdiceUsed;
    for (const hd of block.hitdice) {
      const used = Math.min(remainingUsed, hd.value);
      newHitdiceUsed[hd.dice] = used;
      remainingUsed -= used;
      if (remainingUsed <= 0) break;
    }

    return {
      ...state,
      hitdiceUsed: newHitdiceUsed,
    };
  }

  // If we have a single hit die type but state is using a record (downgrade scenario)
  if (block.hitdice && block.hitdice.length === 1 && typeof state.hitdiceUsed === "object") {
    const dice = block.hitdice[0].dice;
    const used = state.hitdiceUsed[dice] || 0;

    return {
      ...state,
      hitdiceUsed: used,
    };
  }

  return state;
}
