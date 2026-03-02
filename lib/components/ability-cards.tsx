import * as AbilityService from "../domains/abilities";
import { Ability } from "../types";

export function AbilityView(data: Ability[]) {
  return (
    <div className="dnd-ui-ability-scores-container">
      <div className="dnd-ui-ability-scores-grid">
        {data.map((item) => (
          <div className={`dnd-ui-ability-score-card ${item.isProficient ? "dnd-ui-proficient" : ""}`} key={item.label}>
            <div className="dnd-ui-ability-header">
              <p className="dnd-ui-ability-name">{item.label}</p>
              <p className="dnd-ui-ability-value">{item.total}</p>
            </div>
            <p className="dnd-ui-ability-modifier">{AbilityService.formatModifier(item.modifier)}</p>

            <div className="dnd-ui-ability-modifier-saving">
              <em>Saving {AbilityService.formatModifier(item.savingThrow)}</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
