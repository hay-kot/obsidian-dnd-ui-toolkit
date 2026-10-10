import * as Utils from "lib/utils/utils";
import { EventButtonsBlock, EventButtonItem } from "lib/types";
import { parseYamlObject } from "lib/utils/yaml";

export function parseEventButtonsBlock(yamlString: string): EventButtonsBlock {
  const parsed = parseYamlObject<{ items: Partial<EventButtonItem>[] }>(yamlString);

  // Validate that we have items array
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error("Event buttons block must contain an 'items' array");
  }

  const defItem: EventButtonItem = {
    name: "Unnamed button",
    value: "custom",
  };

  // Apply defaults to each item and validate required fields
  const items = parsed.items.map((item, index) => {
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
