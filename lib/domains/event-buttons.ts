import * as Utils from "lib/utils/utils";
import { EventButtonsBlock, EventButtonItem } from "lib/types";
import { parse } from "yaml";

export function parseEventButtonsBlock(yamlString: string): EventButtonsBlock {
  const parsed = parse(yamlString);

  // Validate that we have items array
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error("Event buttons block must contain an 'items' array");
  }

  const defItem: EventButtonItem = {
    name: "Unnamed Button",
    value: "custom",
  };

  // Apply defaults to each item and validate required fields
  const items = parsed.items.map((item: any, index: number) => {
    const processedItem = Utils.mergeWithDefaults(item, defItem);

    // Validate required fields
    if (!processedItem.value) {
      throw new Error(`Event button item at index ${index} must contain a 'value' property`);
    }

    return processedItem;
  });

  return {
    items,
  };
}
