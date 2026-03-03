import * as Utils from "lib/utils/utils";
import { ConsumableBlock, ParsedConsumableBlock } from "lib/types";
import { parse } from "yaml";
import { normalizeResetConfig } from "lib/domains/events";

export interface ConsumableState {
  value: number;
}

// Intermediate type before template resolution where uses can still be a string
type UnresolvedConsumableBlock = Omit<ParsedConsumableBlock, "uses"> & {
  uses: number | string;
};

export interface ConsumablesBlock {
  items: UnresolvedConsumableBlock[];
}

export function parseConsumableBlock(yamlString: string): UnresolvedConsumableBlock {
  const def: ConsumableBlock = {
    label: "Consumable",
    // @ts-expect-error - no viable default for state_key
    state_key: undefined,
    uses: 3,
    reset_on: undefined,
  };

  const parsed = parse(yamlString);
  const merged = Utils.mergeWithDefaults(parsed, def);

  // Normalize reset_on to always be an array of ResetConfig objects
  const normalized: UnresolvedConsumableBlock = {
    ...merged,
    reset_on: normalizeResetConfig(merged.reset_on),
  };

  return normalized;
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

    // Apply defaults to each item and normalize reset_on
    return {
      items: parsed.items.map((item: any) => {
        const merged = Utils.mergeWithDefaults(item, defItem);
        return {
          ...merged,
          reset_on: normalizeResetConfig(merged.reset_on),
        } as UnresolvedConsumableBlock;
      }),
    };
  }

  // Backward compatibility: if no items array, treat the whole object as a single consumable
  const singleConsumable = parseConsumableBlock(yamlString);
  return {
    items: [singleConsumable],
  };
}

export function getDefaultConsumableState(_: ParsedConsumableBlock): ConsumableState {
  return {
    value: 0,
  };
}
