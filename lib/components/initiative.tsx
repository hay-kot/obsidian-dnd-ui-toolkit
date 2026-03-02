import { useState } from "react";
import type { InitiativeBlock, InitiativeItem, InitiativeConsumable, ParsedConsumableBlock } from "lib/types";
import { getSortedInitiativeItems, getMaxHp, itemHashKey, InitiativeState } from "lib/domains/initiative";
import { MultiConsumableCheckboxes } from "lib/components/multi-consumable-checkboxes";
import { ConsumableState } from "lib/domains/consumables";

export type InitiativeProps = {
  static: InitiativeBlock;
  state: InitiativeState;
  onStateChange: (newState: InitiativeState) => void;
};

// Convert InitiativeConsumable to ParsedConsumableBlock format for ConsumableCheckboxes
function adaptInitiativeConsumable(consumable: InitiativeConsumable): ParsedConsumableBlock {
  return {
    label: consumable.label,
    state_key: consumable.state_key,
    uses: consumable.uses,
    reset_on: consumable.reset_on_round ? [{ event: "round", amount: undefined }] : undefined,
  };
}

export function Initiative(props: InitiativeProps) {
  const [inputValue, setInputValue] = useState<string>("1");

  const sortedItems = getSortedInitiativeItems(props.static.items, props.state.initiatives);

  const handleSetInitiative = (item: InitiativeItem, value: string) => {
    const itemHash = itemHashKey(item);
    const initiativeValue = parseInt(value) || 0;
    const newInitiatives = { ...props.state.initiatives };

    newInitiatives[itemHash] = initiativeValue;
    props.onStateChange({
      ...props.state,
      initiatives: newInitiatives,
    });
  };

  const handleDamage = (
    item: InitiativeItem,
    monsterKey: string,
    value: string,
    type: "damage" | "heal" = "damage"
  ) => {
    const parsedValue = parseInt(value) || 0;
    if (parsedValue <= 0) {
      return;
    }

    const itemHash = itemHashKey(item);

    const newHp = { ...props.state.hp };
    if (!newHp[itemHash]) {
      newHp[itemHash] = {};
    }

    const currentHp = newHp[itemHash][monsterKey] || 0;

    let applyValue = 0;
    if (type === "damage") {
      applyValue = Math.max(0, currentHp - parsedValue);
    } else {
      const maxHp = getMaxHp(item, monsterKey);
      applyValue = Math.min(maxHp, currentHp + parsedValue);
    }

    newHp[itemHash] = {
      ...newHp[itemHash],
      [monsterKey]: applyValue,
    };

    props.onStateChange({ ...props.state, hp: newHp });
  };

  const handleNext = () => {
    if (sortedItems.length === 0) return;

    const currentActiveIndex = props.state.activeIndex;
    let nextActiveIndex = -1;
    let newRound = props.state.round;
    const newConsumables = { ...(props.state.consumables || {}) };

    // Find the index of the current active item in the sorted list
    const currentActiveItemIndex = sortedItems.findIndex((item) => item.index === currentActiveIndex);

    if (currentActiveItemIndex === -1 || currentActiveItemIndex === sortedItems.length - 1) {
      // If no active item or at the end of the list, go to the first item
      nextActiveIndex = sortedItems[0].index;
      // Increment round when cycling back to the beginning
      if (currentActiveItemIndex !== -1) {
        newRound = props.state.round + 1;

        // Reset consumables that have reset_on_round: true
        if (props.static.consumables) {
          props.static.consumables.forEach((consumable) => {
            if (consumable.reset_on_round) {
              newConsumables[consumable.state_key] = 0;
            }
          });
        }
      }
    } else {
      // Otherwise, go to the next item
      nextActiveIndex = sortedItems[currentActiveItemIndex + 1].index;
    }

    props.onStateChange({
      ...props.state,
      activeIndex: nextActiveIndex,
      round: newRound,
      consumables: newConsumables,
    });
  };

  const handlePrev = () => {
    if (sortedItems.length === 0) return;

    const currentActiveIndex = props.state.activeIndex;
    let prevActiveIndex = -1;
    let newRound = props.state.round;

    // Find the index of the current active item in the sorted list
    const currentActiveItemIndex = sortedItems.findIndex((item) => item.index === currentActiveIndex);

    if (currentActiveItemIndex === -1 || currentActiveItemIndex === 0) {
      // If no active item or at the beginning of the list, go to the last item
      prevActiveIndex = sortedItems[sortedItems.length - 1].index;
      // Decrement round when cycling back to the end
      if (currentActiveItemIndex !== -1 && props.state.round > 1) {
        newRound = props.state.round - 1;
      }
    } else {
      // Otherwise, go to the previous item
      prevActiveIndex = sortedItems[currentActiveItemIndex - 1].index;
    }

    props.onStateChange({
      ...props.state,
      activeIndex: prevActiveIndex,
      round: newRound,
    });
  };

  const handleReset = () => {
    // Reset all initiatives to 0 and HP to max values
    const newInitiatives = { ...props.state.initiatives };
    const newHp: Record<string, Record<string, number>> = {};
    const newConsumables: Record<string, number> = {};

    props.static.items.forEach((item) => {
      const indexStr = itemHashKey(item);
      newInitiatives[indexStr] = 0;
      newHp[indexStr] = {};

      if (typeof item.hp === "number") {
        newHp[indexStr]["main"] = item.hp;
      } else if (item.hp && typeof item.hp === "object") {
        Object.entries(item.hp).forEach(([key, value]) => {
          newHp[indexStr][key] = value as number;
        });
      }
    });

    // Reset all consumables to 0
    if (props.static.consumables) {
      props.static.consumables.forEach((consumable) => {
        newConsumables[consumable.state_key] = 0;
      });
    }

    props.onStateChange({
      ...props.state,
      activeIndex: -1,
      initiatives: newInitiatives,
      hp: newHp,
      round: 1, // Reset to round 1
      consumables: newConsumables,
    });
  };

  // Handle consumable state change from MultiConsumableCheckboxes
  const handleConsumableStateChange = (stateKey: string, newState: ConsumableState) => {
    const newConsumables = { ...(props.state.consumables || {}) };
    newConsumables[stateKey] = newState.value;

    props.onStateChange({
      ...props.state,
      consumables: newConsumables,
    });
  };

  // Render a single monster's HP
  const renderMonsterHp = (
    item: InitiativeItem,
    index: number,
    monsterKey: string,
    monsterLabel: string,
    maxHp: number
  ) => {
    const currentHp = props.state.hp[itemHashKey(item)]?.[monsterKey] || 0;
    // Add status class based on health percentage
    const healthPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    let statusClass = "";
    if (currentHp <= 0) {
      statusClass = "dnd-ui-monster-status-dead";
    } else if (healthPercent <= 33) {
      statusClass = "dnd-ui-monster-status-injured";
    } else if (healthPercent >= 90) {
      statusClass = "dnd-ui-monster-status-healthy";
    }

    return (
      <div key={`${index}-${monsterKey}`} className="dnd-ui-initiative-monster">
        <div className="dnd-ui-initiative-monster-header">
          <span className={`dnd-ui-initiative-monster-name ${statusClass}`}>{monsterLabel}</span>
          <span className="dnd-ui-initiative-monster-hp">
            <span className="dnd-ui-initiative-hp-value">{currentHp}</span>
            <span className="dnd-ui-initiative-hp-separator">/</span>
            <span className="dnd-ui-initiative-hp-max">{maxHp}</span>
          </span>
        </div>
        <div className="dnd-ui-initiative-monster-actions">
          <input
            type="number"
            className="dnd-ui-initiative-hp-input"
            placeholder="0"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="dnd-ui-initiative-hp-button dnd-ui-initiative-damage"
            onClick={() => {
              handleDamage(props.static.items[index], monsterKey, inputValue);
              setInputValue("1");
            }}
            title="Damage"
          >
            −
          </button>
          <button
            className="dnd-ui-initiative-hp-button dnd-ui-initiative-heal"
            onClick={() => {
              handleDamage(props.static.items[index], monsterKey, inputValue, "heal");
              setInputValue("1");
            }}
            title="Heal"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // Render HP section based on whether it's a group or single monster
  const renderHpSection = (item: InitiativeItem, index: number) => {
    if (!item.hp) return null;

    const hashKey = itemHashKey(item);

    const itemHp = props.state.hp[hashKey] || {};
    const isGroup = typeof item.hp === "object" && Object.keys(item.hp).length > 1;

    if (isGroup) {
      // It's a group of monsters with individual HP tracking
      return (
        <div className="dnd-ui-initiative-group-hp">
          {Object.entries(item.hp as Record<string, number>).map(([key, maxHp]) =>
            renderMonsterHp(item, index, key, key, maxHp)
          )}
        </div>
      );
    } else {
      // It's a single monster
      const monsterKey = Object.keys(itemHp)[0] || "main";
      const maxHp = getMaxHp(item);
      const currentHp = itemHp[monsterKey] || 0;

      // Status class based on health percentage
      const healthPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
      let statusClass = "";
      if (currentHp <= 0) {
        statusClass = "dnd-ui-monster-status-dead";
      } else if (healthPercent <= 33) {
        statusClass = "dnd-ui-monster-status-injured";
      }

      // Always render HP with inline controls
      return (
        <div className={`dnd-ui-initiative-hp-inline ${statusClass}`}>
          <div className="dnd-ui-initiative-hp-display">
            <span className="dnd-ui-initiative-hp-value">{currentHp}</span>
            <span className="dnd-ui-initiative-hp-separator">/</span>
            <span className="dnd-ui-initiative-hp-max">{maxHp}</span>
          </div>
          <div className="dnd-ui-initiative-hp-controls">
            <input
              type="number"
              className="dnd-ui-initiative-hp-input"
              placeholder="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="dnd-ui-initiative-hp-button dnd-ui-initiative-damage"
              onClick={() => {
                handleDamage(props.static.items[index], monsterKey, inputValue);
                setInputValue("1");
              }}
              title="Damage"
            >
              −
            </button>
            <button
              className="dnd-ui-initiative-hp-button dnd-ui-initiative-heal"
              onClick={() => {
                handleDamage(props.static.items[index], monsterKey, inputValue, "heal");
                setInputValue("1");
              }}
              title="Heal"
            >
              +
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dnd-ui-initiative-tracker">
      <div className="dnd-ui-initiative-tracker-controls">
        <div className="dnd-ui-initiative-round-counter">
          Round: <span className="dnd-ui-initiative-round-value">{props.state.round}</span>
        </div>
        <button
          className="dnd-ui-initiative-control-button dnd-ui-initiative-prev"
          onClick={handlePrev}
          aria-label="Previous combatant"
        >
          ◀ Prev
        </button>
        <button
          className="dnd-ui-initiative-control-button dnd-ui-initiative-next"
          onClick={handleNext}
          aria-label="Next combatant"
        >
          Next ▶
        </button>
        <button
          className="dnd-ui-initiative-control-button dnd-ui-initiative-reset"
          onClick={handleReset}
          aria-label="Reset initiative"
        >
          Reset
        </button>
      </div>

      {/* Consumables Section */}
      {props.static.consumables && props.static.consumables.length > 0 && (
        <MultiConsumableCheckboxes
          consumables={props.static.consumables.map(adaptInitiativeConsumable)}
          states={Object.fromEntries(
            props.static.consumables.map((consumable) => [
              consumable.state_key,
              { value: props.state.consumables?.[consumable.state_key] || 0 },
            ])
          )}
          onStateChange={handleConsumableStateChange}
        />
      )}

      <div className="dnd-ui-initiative-list">
        {sortedItems.length === 0 ? (
          <div className="dnd-ui-initiative-empty-state">No combatants added</div>
        ) : (
          <div className="dnd-ui-initiative-items">
            {sortedItems.map(({ item, index, initiative }) => {
              const isActive = index === props.state.activeIndex;
              const hasHp = item.hp !== undefined;
              const isGroupMonster = hasHp && typeof item.hp === "object" && Object.keys(item.hp).length > 1;

              return (
                <div
                  key={index}
                  className={`dnd-ui-initiative-item ${isActive ? "dnd-ui-initiative-item-active" : ""} ${isGroupMonster ? "dnd-ui-initiative-item-group" : ""}`}
                >
                  <div className="dnd-ui-initiative-item-main">
                    <div className="dnd-ui-initiative-roll">
                      <input
                        type="number"
                        value={initiative || ""}
                        onChange={(e) => handleSetInitiative(props.static.items[index], e.target.value)}
                        className="dnd-ui-initiative-input"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <div className="dnd-ui-initiative-name">
                        {item.link ? (
                          <a href={item.link} className="dnd-ui-initiative-link">
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </div>
                      <div className="dnd-ui-initiative-ac">
                        AC: <span className="dnd-ui-initiative-ac-value">{item.ac}</span>
                      </div>
                    </div>

                    {hasHp && !isGroupMonster && renderHpSection(item, index)}
                  </div>

                  {/* HP actions are now always inline - no separate section needed */}

                  {isGroupMonster && (
                    <>
                      <div className="dnd-ui-divider"></div>
                      <div className="dnd-ui-initiative-group-container">{renderHpSection(item, index)}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
