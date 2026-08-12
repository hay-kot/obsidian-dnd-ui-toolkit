import { describe, it, expect } from "vitest";
import {
  parseHealthBlock,
  getDefaultHealthState,
  migrateHealthState,
  isSingleHitDiceState,
  isMultiHitDiceState,
  hasSingleHitDice,
  hasMultipleHitDice,
  getBaseHealth,
  getTempMaxHealth,
  getMaxHealth,
  getHitDiceUsed,
  computeResetState,
  clampHealthState,
} from "./healthpoints";
import type { ParsedHealthBlock, HealthState } from "lib/types";

describe("healthpoints", () => {
  describe("parseHealthBlock", () => {
    it("should parse a basic health block", () => {
      const yaml = `
state_key: test_health
health: 24
`;
      const result = parseHealthBlock(yaml);
      expect(result.state_key).toBe("test_health");
      expect(result.health).toBe(24);
      expect(result.label).toBe("Hit Points");
      expect(result.death_saves).toBe(true);
    });

    it("should parse single hit dice format", () => {
      const yaml = `
state_key: test_health
health: 24
hitdice:
  dice: d6
  value: 4
`;
      const result = parseHealthBlock(yaml);
      expect(result.hitdice).toEqual([{ dice: "d6", value: 4 }]);
    });

    it("should parse multiple hit dice format", () => {
      const yaml = `
state_key: test_health
health: 24
hitdice:
  - dice: d10
    value: 3
  - dice: d6
    value: 2
`;
      const result = parseHealthBlock(yaml);
      expect(result.hitdice).toEqual([
        { dice: "d10", value: 3 },
        { dice: "d6", value: 2 },
      ]);
    });

    it("should handle custom labels", () => {
      const yaml = `
state_key: test_health
label: Vitality
health: 30
`;
      const result = parseHealthBlock(yaml);
      expect(result.label).toBe("Vitality");
    });

    it("should handle reset configuration", () => {
      const yaml = `
state_key: test_health
health: 20
reset_on: short-rest
`;
      const result = parseHealthBlock(yaml);
      expect(result.reset_on).toEqual([{ event: "short-rest" }]);
    });

    it("should default temp max health to 0", () => {
      const result = parseHealthBlock(`
state_key: test_health
health: 20
`);
      expect(result.temp_max_health).toBe(0);
    });

    it("should parse temp max health", () => {
      const result = parseHealthBlock(`
state_key: test_health
health: 20
temp_max_health: 5
`);
      expect(result.temp_max_health).toBe(5);
    });

    it("should normalize hit dice reset configuration", () => {
      const yaml = `
state_key: test_health
health: 20
hitdice:
  dice: d6
  value: 4
  reset_on:
    - event: long-rest
      amount: 2
`;
      const result = parseHealthBlock(yaml);
      expect(result.hitdice).toEqual([{ dice: "d6", value: 4, reset_on: [{ event: "long-rest", amount: 2 }] }]);
    });

    it("should normalize a string hit dice reset configuration", () => {
      const yaml = `
state_key: test_health
health: 20
hitdice:
  - dice: d10
    value: 3
    reset_on: short-rest
  - dice: d6
    value: 2
`;
      const result = parseHealthBlock(yaml);
      expect(result.hitdice?.[0].reset_on).toEqual([{ event: "short-rest" }]);
      expect(result.hitdice?.[1].reset_on).toBeUndefined();
    });
  });

  describe("max health", () => {
    const block: ParsedHealthBlock = {
      state_key: "test",
      label: "Hit Points",
      health: 24,
      temp_max_health: 5,
      death_saves: true,
    };

    it("should add temp max health on top of base health", () => {
      expect(getBaseHealth(block)).toBe(24);
      expect(getTempMaxHealth(block)).toBe(5);
      expect(getMaxHealth(block)).toBe(29);
    });

    it("should ignore negative temp max health", () => {
      expect(getMaxHealth({ ...block, temp_max_health: -5 })).toBe(24);
    });

    it("should treat missing temp max health as 0", () => {
      expect(getMaxHealth({ ...block, temp_max_health: undefined })).toBe(24);
    });

    it("should fall back to 6 when health is unresolved", () => {
      expect(getMaxHealth({ ...block, health: "{{frontmatter.hp}}" })).toBe(11);
    });

    it("should include temp max health in the default state", () => {
      expect(getDefaultHealthState(block).current).toBe(29);
    });
  });

  describe("clampHealthState", () => {
    const block: ParsedHealthBlock = {
      state_key: "test",
      label: "Hit Points",
      health: 24,
      death_saves: true,
    };

    const state: HealthState = {
      current: 29,
      temporary: 0,
      hitdiceUsed: 0,
      deathSaveSuccesses: 0,
      deathSaveFailures: 0,
    };

    it("should cap current health when the temp max is removed", () => {
      expect(clampHealthState(state, block).current).toBe(24);
    });

    it("should leave state alone when current health fits", () => {
      expect(clampHealthState(state, { ...block, temp_max_health: 5 })).toBe(state);
    });

    it("should leave state alone when health is unresolved", () => {
      expect(clampHealthState(state, { ...block, health: "{{frontmatter.hp}}" })).toBe(state);
    });
  });

  describe("computeResetState", () => {
    function stateWith(overrides?: Partial<HealthState>): HealthState {
      return {
        current: 5,
        temporary: 3,
        hitdiceUsed: 4,
        deathSaveSuccesses: 1,
        deathSaveFailures: 2,
        ...overrides,
      };
    }

    const block: ParsedHealthBlock = {
      state_key: "test",
      label: "Hit Points",
      health: 24,
      hitdice: [{ dice: "d6", value: 4 }],
      death_saves: true,
      reset_on: [{ event: "long-rest" }],
    };

    it("should fully restore health, temp hp, death saves and hit dice", () => {
      expect(computeResetState(stateWith(), block, "long-rest")).toEqual({
        current: 24,
        temporary: 0,
        hitdiceUsed: 0,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      });
    });

    it("should restore up to the temp max health", () => {
      const reset = computeResetState(stateWith(), { ...block, temp_max_health: 5 }, "long-rest");
      expect(reset.current).toBe(29);
    });

    it("should ignore events the block does not reset on", () => {
      const state = stateWith();
      expect(computeResetState(state, block, "short-rest")).toBe(state);
    });

    it("should restore only the configured amount of hit dice", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "long-rest", amount: 1 }] }],
      };

      const reset = computeResetState(stateWith(), partial, "long-rest");
      expect(reset.hitdiceUsed).toBe(3);
      expect(reset.current).toBe(24);
    });

    it("should not restore more hit dice than were used", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "long-rest", amount: 3 }] }],
      };

      expect(computeResetState(stateWith({ hitdiceUsed: 2 }), partial, "long-rest").hitdiceUsed).toBe(0);
    });

    it("should restore all hit dice when the dice config has no amount", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "long-rest" }] }],
      };

      expect(computeResetState(stateWith(), partial, "long-rest").hitdiceUsed).toBe(0);
    });

    it("should keep hit dice untouched when their own reset config does not match the event", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        reset_on: [{ event: "long-rest" }, { event: "short-rest" }],
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "short-rest", amount: 1 }] }],
      };

      const reset = computeResetState(stateWith(), partial, "long-rest");
      expect(reset.hitdiceUsed).toBe(4);
      expect(reset.current).toBe(24);
    });

    it("should restore hit dice on an event the block itself ignores", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "short-rest", amount: 1 }] }],
      };

      const reset = computeResetState(stateWith(), partial, "short-rest");
      expect(reset.hitdiceUsed).toBe(3);
      expect(reset.current).toBe(5); // health untouched — the block only resets on long-rest
      expect(reset.temporary).toBe(3);
    });

    it("should apply per-dice amounts independently for multiclass hit dice", () => {
      const multiclass: ParsedHealthBlock = {
        ...block,
        hitdice: [
          { dice: "d10", value: 5, reset_on: [{ event: "long-rest", amount: 2 }] },
          { dice: "d6", value: 3 },
        ],
      };

      const reset = computeResetState(stateWith({ hitdiceUsed: { d10: 4, d6: 3 } }), multiclass, "long-rest");
      expect(reset.hitdiceUsed).toEqual({ d10: 2, d6: 0 });
    });

    it("should treat an amount of 0 as restoring nothing", () => {
      const partial: ParsedHealthBlock = {
        ...block,
        hitdice: [{ dice: "d6", value: 4, reset_on: [{ event: "long-rest", amount: 0 }] }],
      };

      expect(computeResetState(stateWith(), partial, "long-rest").hitdiceUsed).toBe(4);
    });
  });

  describe("getHitDiceUsed", () => {
    it("should read the flat count for a single dice type", () => {
      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [{ dice: "d6", value: 4 }],
        death_saves: true,
      };

      expect(getHitDiceUsed(block, { ...getDefaultHealthState(block), hitdiceUsed: 2 }, "d6")).toBe(2);
    });

    it("should read per-dice counts for multiple dice types", () => {
      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [
          { dice: "d10", value: 3 },
          { dice: "d6", value: 2 },
        ],
        death_saves: true,
      };

      const state = { ...getDefaultHealthState(block), hitdiceUsed: { d10: 1, d6: 2 } };
      expect(getHitDiceUsed(block, state, "d10")).toBe(1);
      expect(getHitDiceUsed(block, state, "d6")).toBe(2);
      expect(getHitDiceUsed(block, state, "d8")).toBe(0);
    });
  });

  describe("getDefaultHealthState", () => {
    it("should create default state for single hit dice", () => {
      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [{ dice: "d6", value: 4 }],
        death_saves: true,
      };

      const state = getDefaultHealthState(block);
      expect(state.current).toBe(24);
      expect(state.temporary).toBe(0);
      expect(state.hitdiceUsed).toBe(0);
      expect(state.deathSaveSuccesses).toBe(0);
      expect(state.deathSaveFailures).toBe(0);
    });

    it("should create default state for multiple hit dice", () => {
      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [
          { dice: "d10", value: 3 },
          { dice: "d6", value: 2 },
        ],
        death_saves: true,
      };

      const state = getDefaultHealthState(block);
      expect(state.current).toBe(24);
      expect(state.temporary).toBe(0);
      expect(state.hitdiceUsed).toEqual({
        d10: 0,
        d6: 0,
      });
    });

    it("should handle no hit dice", () => {
      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        death_saves: true,
      };

      const state = getDefaultHealthState(block);
      expect(state.hitdiceUsed).toBe(0);
    });
  });

  describe("migrateHealthState", () => {
    it("should migrate from single to multiple hit dice", () => {
      const oldState: HealthState = {
        current: 20,
        temporary: 5,
        hitdiceUsed: 3, // Used 3 hit dice total
        deathSaveSuccesses: 1,
        deathSaveFailures: 0,
      };

      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [
          { dice: "d10", value: 3 },
          { dice: "d6", value: 2 },
        ],
        death_saves: true,
      };

      const migrated = migrateHealthState(oldState, block);
      expect(migrated.current).toBe(20);
      expect(migrated.temporary).toBe(5);
      expect(migrated.hitdiceUsed).toEqual({
        d10: 3, // All 3 used dice go to d10 first
        d6: 0,
      });
      expect(migrated.deathSaveSuccesses).toBe(1);
      expect(migrated.deathSaveFailures).toBe(0);
    });

    it("should migrate from multiple to single hit dice", () => {
      const oldState: HealthState = {
        current: 20,
        temporary: 5,
        hitdiceUsed: {
          d10: 2,
          d6: 1,
        },
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      };

      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [{ dice: "d10", value: 5 }],
        death_saves: true,
      };

      const migrated = migrateHealthState(oldState, block);
      expect(migrated.current).toBe(20);
      expect(migrated.temporary).toBe(5);
      expect(migrated.hitdiceUsed).toBe(2); // Only d10 count is preserved
    });

    it("should not migrate if formats match", () => {
      const state: HealthState = {
        current: 20,
        temporary: 5,
        hitdiceUsed: 2,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      };

      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [{ dice: "d6", value: 4 }],
        death_saves: true,
      };

      const migrated = migrateHealthState(state, block);
      expect(migrated).toBe(state); // Should return same object
    });

    it("should handle overflow when migrating to multiple dice", () => {
      const oldState: HealthState = {
        current: 20,
        temporary: 5,
        hitdiceUsed: 7, // More than first dice type
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      };

      const block: ParsedHealthBlock = {
        state_key: "test",
        label: "Hit Points",
        health: 24,
        hitdice: [
          { dice: "d10", value: 3 },
          { dice: "d6", value: 4 },
        ],
        death_saves: true,
      };

      const migrated = migrateHealthState(oldState, block);
      expect(migrated.hitdiceUsed).toEqual({
        d10: 3, // Max out first type
        d6: 4, // Remaining 4 go to second type
      });
    });
  });

  describe("type guards", () => {
    describe("isSingleHitDiceState", () => {
      it("should return true for number hitdiceUsed", () => {
        const state: HealthState = {
          current: 20,
          temporary: 0,
          hitdiceUsed: 3,
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
        };

        expect(isSingleHitDiceState(state)).toBe(true);
      });

      it("should return false for object hitdiceUsed", () => {
        const state: HealthState = {
          current: 20,
          temporary: 0,
          hitdiceUsed: { d10: 2, d6: 1 },
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
        };

        expect(isSingleHitDiceState(state)).toBe(false);
      });
    });

    describe("isMultiHitDiceState", () => {
      it("should return true for object hitdiceUsed", () => {
        const state: HealthState = {
          current: 20,
          temporary: 0,
          hitdiceUsed: { d10: 2, d6: 1 },
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
        };

        expect(isMultiHitDiceState(state)).toBe(true);
      });

      it("should return false for number hitdiceUsed", () => {
        const state: HealthState = {
          current: 20,
          temporary: 0,
          hitdiceUsed: 3,
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
        };

        expect(isMultiHitDiceState(state)).toBe(false);
      });

      it("should return false for null hitdiceUsed", () => {
        const state: HealthState = {
          current: 20,
          temporary: 0,
          hitdiceUsed: null as any, // Simulating edge case
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
        };

        expect(isMultiHitDiceState(state)).toBe(false);
      });
    });

    describe("hasSingleHitDice", () => {
      it("should return true for single hit dice block", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          hitdice: [{ dice: "d6", value: 4 }],
          death_saves: true,
        };

        expect(hasSingleHitDice(block)).toBe(true);
      });

      it("should return false for multiple hit dice block", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          hitdice: [
            { dice: "d10", value: 3 },
            { dice: "d6", value: 2 },
          ],
          death_saves: true,
        };

        expect(hasSingleHitDice(block)).toBe(false);
      });

      it("should return false for no hit dice", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          death_saves: true,
        };

        expect(hasSingleHitDice(block)).toBe(false);
      });
    });

    describe("hasMultipleHitDice", () => {
      it("should return true for multiple hit dice block", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          hitdice: [
            { dice: "d10", value: 3 },
            { dice: "d6", value: 2 },
          ],
          death_saves: true,
        };

        expect(hasMultipleHitDice(block)).toBe(true);
      });

      it("should return false for single hit dice block", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          hitdice: [{ dice: "d6", value: 4 }],
          death_saves: true,
        };

        expect(hasMultipleHitDice(block)).toBe(false);
      });

      it("should return false for no hit dice", () => {
        const block: ParsedHealthBlock = {
          state_key: "test",
          label: "Hit Points",
          health: 24,
          death_saves: true,
        };

        expect(hasMultipleHitDice(block)).toBe(false);
      });
    });
  });
});
