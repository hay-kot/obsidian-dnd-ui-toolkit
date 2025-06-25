import { ParsedConsumableBlock } from "lib/types";
import { ConsumableState } from "lib/domains/consumables";
import { Checkbox } from "lib/components/checkbox";

export type ConsumableCheckboxesProps = {
  static: ParsedConsumableBlock;
  state: ConsumableState;
  onStateChange: (newState: ConsumableState) => void;
};

export function ConsumableCheckboxes(props: ConsumableCheckboxesProps) {
  // Toggle usage of a specific checkbox
  const toggleUsage = (index: number) => {
    let newValue = props.state.value;

    // If the checkbox was checked (index < available uses)
    if (index < props.state.value) {
      // Uncheck this box
      newValue = index;
    } else {
      // Check this box
      newValue = index + 1;
    }

    props.onStateChange({
      value: newValue,
    });
  };

  // Render checkboxes for uses
  const renderCheckboxes = () => {
    const checkboxes = [];
    for (let i = 0; i < props.static.uses; i++) {
      checkboxes.push(
        <Checkbox
          key={i}
          checked={i < props.state.value}
          id={`consumable-${props.static.state_key}-${i}`}
          onChange={() => toggleUsage(i)}
        />
      );
    }
    return checkboxes;
  };

  return (
    <div className="consumable-container">
      {props.static.label && <span className="consumable-label">{props.static.label}</span>}
      <div className="consumable-boxes">{renderCheckboxes()}</div>
    </div>
  );
}
