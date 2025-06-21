import * as AbilityService from "../domains/abilities";
import { Ability } from "../types";

export function AbilityView(data: Ability[]) {
  return (
    <div className="ability-scores-container">
      <div className="ability-scores-grid">
        {data.map((item) => (
          <div className={`ability-score-card ${item.isProficient ? "proficient" : ""}`} key={item.label}>
            <div className="ability-header">
              <p className="ability-name">{item.label}</p>
              <p className="ability-value">{item.total}</p>
            </div>
            <p className="ability-modifier">{AbilityService.formatModifier(item.modifier)}</p>

            <div className="ability-modifier-saving">
              <em>Saving {AbilityService.formatModifier(item.savingThrow)}</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
