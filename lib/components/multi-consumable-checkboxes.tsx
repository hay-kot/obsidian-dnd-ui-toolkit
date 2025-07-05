import { ParsedConsumableBlock } from "lib/types";
import { ConsumableState } from "lib/domains/consumables";
import { ConsumableCheckboxes } from "lib/components/consumable-checkboxes";
import { useEffect, useRef } from "react";

export type MultiConsumableCheckboxesProps = {
  consumables: ParsedConsumableBlock[];
  states: Record<string, ConsumableState>;
  onStateChange: (stateKey: string, newState: ConsumableState) => void;
};

export function MultiConsumableCheckboxes(props: MultiConsumableCheckboxesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate and set the label width based on the longest label
  useEffect(() => {
    if (!containerRef.current) return;

    // Find the longest label to calculate proper alignment
    let maxLabelLength = 0;
    props.consumables.forEach((consumable) => {
      if (consumable.label && consumable.label.length > maxLabelLength) {
        maxLabelLength = consumable.label.length;
      }
    });

    // Apply the calculated width to a CSS variable
    const labelWidthEm = Math.max(3, maxLabelLength * 0.55); // Adjust multiplier based on font size
    containerRef.current.style.setProperty("--consumable-label-width", `${labelWidthEm}em`);
  }, [props.consumables]);

  return (
    <div ref={containerRef} className="consumables-column">
      {props.consumables.map((consumable) => {
        const state = props.states[consumable.state_key] || { value: 0 };

        return (
          <div key={consumable.state_key} className="consumable-item">
            <ConsumableCheckboxes
              static={consumable}
              state={state}
              onStateChange={(newState) => props.onStateChange(consumable.state_key, newState)}
            />
          </div>
        );
      })}
    </div>
  );
}
