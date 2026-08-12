import * as Utils from "lib/utils/utils";
import { HealthBlock, ParsedHealthBlock, UnresolvedHealthBlock } from "lib/types";
import { parse } from "yaml";
import { getResetAmount, normalizeResetConfig, shouldResetOnEvent } from "lib/domains/events";

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

export function parseHealthBlock(yamlString: string): UnresolvedHealthBlock {
  const def: HealthBlock = {
    label: "Hit Points",
    // @ts-expect-error - no viable default for state_key
    state_key: undefined,
    health: 6,
    temp_max_health: 0,
    hitdice: undefined,
    death_saves: true,
    reset_on: "long-rest", // Default to long rest for health recovery
  };

  const parsed = parse(yamlString);
  const merged = Utils.mergeWithDefaults(parsed, def);

  // Normalize hitdice to always be an array
  let normalizedHitdice: UnresolvedHealthBlock["hitdice"] = undefined;
  if (merged.hitdice) {
    const asArray = Array.isArray(merged.hitdice) ? merged.hitdice : [merged.hitdice];
    normalizedHitdice = asArray.map((hd) => ({ ...hd, reset_on: normalizeResetConfig(hd.reset_on) }));
  }

  // Normalize reset_on to always be an array of ResetConfig objects
  const normalized: UnresolvedHealthBlock = {
    ...merged,
    reset_on: normalizeResetConfig(merged.reset_on),
    hitdice: normalizedHitdice,
  };

  return normalized;
}

/** Maximum health from the `health` property alone, excluding any temporary bonus. */
export function getBaseHealth(block: ParsedHealthBlock): number {
  return typeof block.health === "string" ? 6 : block.health; // Default fallback if health is still a string
}

/** Bonus maximum health from temporary effects such as Aid. */
export function getTempMaxHealth(block: ParsedHealthBlock): number {
  return Math.max(0, block.temp_max_health ?? 0);
}

/** Maximum health a character can be healed to, including any temporary bonus. */
export function getMaxHealth(block: ParsedHealthBlock): number {
  return getBaseHealth(block) + getTempMaxHealth(block);
}

export function getDefaultHealthState(block: ParsedHealthBlock): HealthState {
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
    current: getMaxHealth(block),
    temporary: 0,
    hitdiceUsed,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
  };
}

export function getHitDiceUsed(block: ParsedHealthBlock, state: HealthState, dice: string): number {
  if (hasSingleHitDice(block) && isSingleHitDiceState(state)) {
    return state.hitdiceUsed;
  }
  if (isMultiHitDiceState(state)) {
    return state.hitdiceUsed[dice] || 0;
  }
  return 0;
}

export function withHitDiceUsed(block: ParsedHealthBlock, state: HealthState, dice: string, used: number): HealthState {
  if (hasSingleHitDice(block) && isSingleHitDiceState(state)) {
    return { ...state, hitdiceUsed: used };
  }
  return {
    ...state,
    hitdiceUsed: {
      ...(isMultiHitDiceState(state) ? state.hitdiceUsed : {}),
      [dice]: used,
    },
  };
}

/**
 * Applies a rest/reset event to the health state.
 *
 * The block-level `reset_on` restores health, temp HP and death saves. Hit dice follow it too — fully
 * restored — unless the dice entry declares its own `reset_on`, in which case only that config applies and
 * an `amount` restores that many dice instead of all of them.
 */
export function computeResetState(state: HealthState, block: ParsedHealthBlock, eventType: string): HealthState {
  const blockReset = shouldResetOnEvent(block.reset_on, eventType);

  let next: HealthState = blockReset
    ? {
        ...state,
        current: getMaxHealth(block),
        temporary: 0,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      }
    : state;

  for (const hd of block.hitdice ?? []) {
    const used = getHitDiceUsed(block, next, hd.dice);

    let restored: number;
    if (hd.reset_on) {
      if (!shouldResetOnEvent(hd.reset_on, eventType)) continue;
      const amount = getResetAmount(hd.reset_on, eventType);
      restored = amount === undefined ? 0 : Math.max(0, used - amount);
    } else if (blockReset) {
      restored = 0;
    } else {
      continue;
    }

    if (restored !== used) {
      next = withHitDiceUsed(block, next, hd.dice, restored);
    }
  }

  return next;
}

/**
 * Caps current health at the block's maximum, which shrinks when a temporary max health effect ends.
 * Skipped while `health` is unresolved, since the 6 HP fallback would otherwise wipe out real state.
 */
export function clampHealthState(state: HealthState, block: ParsedHealthBlock): HealthState {
  if (typeof block.health !== "number") return state;

  const max = getMaxHealth(block);
  return state.current > max ? { ...state, current: max } : state;
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
