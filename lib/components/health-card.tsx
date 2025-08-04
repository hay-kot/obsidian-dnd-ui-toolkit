import { useState } from "react";
import type { ParsedHealthBlock } from "lib/types";
import { HealthState, isSingleHitDiceState, isMultiHitDiceState, hasSingleHitDice } from "lib/domains/healthpoints";
import { Checkbox } from "lib/components/checkbox";

export type HealthCardProps = {
  static: ParsedHealthBlock;
  state: HealthState;
  onStateChange: (newState: HealthState) => void;
};

export function HealthCard(props: HealthCardProps) {
  const [inputValue, setInputValue] = useState("1");

  // Ensure health is a number for calculations
  const maxHealth = typeof props.static.health === "number" ? props.static.health : 6;

  // Calculate health percentage for progress bar
  const healthPercentage = Math.max(0, Math.min(100, (props.state.current / maxHealth) * 100));

  // Event handlers for health actions
  const handleHeal = () => {
    const value = parseInt(inputValue) || 0;
    if (value <= 0) return;

    const newCurrent = Math.min(props.state.current + value, maxHealth);
    const newState = {
      ...props.state,
      current: newCurrent,
    };

    // Reset death saves if health goes above 0
    if (newCurrent > 0 && props.state.current <= 0) {
      newState.deathSaveSuccesses = 0;
      newState.deathSaveFailures = 0;
    }

    props.onStateChange(newState);
    setInputValue("1");
  };

  const handleDamage = () => {
    const value = parseInt(inputValue) || 0;
    if (value <= 0) return;

    let newTemp = props.state.temporary;
    let newCurrent = props.state.current;

    // Apply damage to temporary HP first
    if (newTemp > 0) {
      if (value <= newTemp) {
        newTemp -= value;
      } else {
        const remainingDamage = value - newTemp;
        newTemp = 0;
        newCurrent = Math.max(0, newCurrent - remainingDamage);
      }
    } else {
      newCurrent = Math.max(0, newCurrent - value);
    }

    props.onStateChange({
      ...props.state,
      current: newCurrent,
      temporary: newTemp,
    });
    setInputValue("1");
  };

  const handleTempHP = () => {
    const value = parseInt(inputValue) || 0;
    if (value <= 0) return;

    // Only replace temporary HP if the new value is higher
    const newTemp = Math.max(props.state.temporary, value);

    props.onStateChange({
      ...props.state,
      temporary: newTemp,
    });
    setInputValue("1");
  };

  // Helper function to calculate new used count based on toggle action
  const calculateNewUsedCount = (currentUsed: number, index: number): number => {
    const isUsed = index < currentUsed;
    if (isUsed) {
      // Uncheck this die and all dice after it
      return index;
    } else {
      // Check this die and all dice before it
      return index + 1;
    }
  };

  // Handle hit dice interaction
  const toggleHitDie = (diceType: string | null, index: number) => {
    if (!diceType && isSingleHitDiceState(props.state)) {
      // Legacy single dice type
      const newHitDiceUsed = calculateNewUsedCount(props.state.hitdiceUsed, index);

      props.onStateChange({
        ...props.state,
        hitdiceUsed: newHitDiceUsed,
      });
    } else if (diceType && isMultiHitDiceState(props.state)) {
      // Multiple dice types
      const currentUsed = props.state.hitdiceUsed[diceType] || 0;
      const newUsed = calculateNewUsedCount(currentUsed, index);

      props.onStateChange({
        ...props.state,
        hitdiceUsed: {
          ...(props.state.hitdiceUsed as Record<string, number>),
          [diceType]: newUsed,
        },
      });
    }
  };

  // Handle death save interaction
  const toggleDeathSave = (type: "success" | "failure", index: number) => {
    const newState = { ...props.state };

    if (type === "success") {
      const isChecked = index < props.state.deathSaveSuccesses;
      if (isChecked) {
        newState.deathSaveSuccesses = index;
      } else {
        newState.deathSaveSuccesses = index + 1;
      }
    } else {
      const isChecked = index < props.state.deathSaveFailures;
      if (isChecked) {
        newState.deathSaveFailures = index;
      } else {
        newState.deathSaveFailures = index + 1;
      }
    }

    props.onStateChange(newState);
  };

  // Handle hit dice rendering
  const renderHitDice = () => {
    if (!props.static.hitdice || props.static.hitdice.length === 0) return null;

    return (
      <div className="hit-dice-list">
        {props.static.hitdice.map((hd) => {
          // Get the used count based on state structure
          let used: number = 0;

          if (hasSingleHitDice(props.static) && isSingleHitDiceState(props.state)) {
            // Legacy single dice with number state
            used = props.state.hitdiceUsed;
          } else if (isMultiHitDiceState(props.state)) {
            // Multiple dice or migrated state
            used = props.state.hitdiceUsed[hd.dice] || 0;
          }

          const hitDiceArray = [];
          for (let i = 0; i < hd.value; i++) {
            hitDiceArray.push(
              <Checkbox
                key={`${hd.dice}-${i}`}
                checked={i < used}
                id={`hit-dice-${hd.dice}-${i}`}
                onChange={() => toggleHitDie(hasSingleHitDice(props.static) ? null : hd.dice, i)}
              />
            );
          }

          return (
            <div key={hd.dice} className="hit-dice-row">
              <p className="hit-dice-label">HIT DICE ({hd.dice})</p>
              <div className="hit-dice-boxes">{hitDiceArray}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle death saves rendering
  const renderDeathSaves = () => {
    if (!props.static.death_saves || props.state.current > 0) return null;

    const failures = [];
    const successes = [];

    // Render failures (left side)
    for (let i = 0; i < 3; i++) {
      failures.push(
        <Checkbox
          key={`failure-${i}`}
          checked={i < props.state.deathSaveFailures}
          id={`death-save-failure-${i}`}
          onChange={() => toggleDeathSave("failure", i)}
          className="death-save-failure"
        />
      );
    }

    // Render successes (right side)
    for (let i = 0; i < 3; i++) {
      successes.push(
        <Checkbox
          key={`success-${i}`}
          checked={i < props.state.deathSaveSuccesses}
          id={`death-save-success-${i}`}
          onChange={() => toggleDeathSave("success", i)}
          className="death-save-success"
        />
      );
    }

    return { failures, successes };
  };

  return (
    <div className="health-card generic-card">
      <div className="health-card-header">
        <div className="generic-card-label">{props.static.label || "Hit Points"}</div>
        <div className="health-value">
          {props.state.current}
          <span className="health-max">/ {maxHealth}</span>
          {props.state.temporary > 0 && <span className="health-temp">+{props.state.temporary} temp</span>}
        </div>
      </div>

      <div className="health-progress-container">
        <div className="health-progress-bar" style={{ width: `${healthPercentage}%` }} />
      </div>

      <div className="health-controls">
        <input
          type="number"
          className="health-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="0"
          aria-label="Health points"
        />
        <button type="button" className="health-button health-heal" onClick={handleHeal}>
          Heal
        </button>
        <button type="button" className="health-button health-damage" onClick={handleDamage}>
          Damage
        </button>
        <button type="button" className="health-button health-temp" onClick={handleTempHP}>
          Temp HP
        </button>
      </div>

      {props.static.hitdice && props.static.hitdice.length > 0 && (
        <>
          <div className="health-divider" />
          <div className="hit-dice-container">{renderHitDice()}</div>
        </>
      )}

      {props.static.death_saves && props.state.current <= 0 && (
        <>
          <div className="health-divider" />
          <div className="death-saves-container">
            <div className="death-saves-tracker">
              <div className="death-saves-failures">{renderDeathSaves()?.failures}</div>
              <div className="death-saves-skull">💀</div>
              <div className="death-saves-successes">{renderDeathSaves()?.successes}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
