import { describe, it, expect } from "vitest";
import {
  parseHealthBlock,
  getDefaultHealthState,
  migrateHealthState,
  isSingleHitDiceState,
  isMultiHitDiceState,
  hasSingleHitDice,
  hasMultipleHitDice,
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
