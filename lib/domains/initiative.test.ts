import { describe, it, expect } from "vitest";
import { getDefaultInitiativeState, mergeInitiativeState } from "./initiative";
import { InitiativeBlock } from "../types";

function makeBlock(items: InitiativeBlock["items"], consumables?: InitiativeBlock["consumables"]): InitiativeBlock {
  return { state_key: "test", items, consumables };
}

describe("initiative", () => {
  describe("getDefaultInitiativeState", () => {
    it("uses name-based keys", () => {
      const block = makeBlock([
        { name: "Goblin", ac: 12, hp: 10 },
        { name: "Dragon", ac: 18, hp: 200 },
      ]);

      const state = getDefaultInitiativeState(block);

      expect(state.initiatives["Goblin"]).toBe(0);
      expect(state.initiatives["Dragon"]).toBe(0);
      expect(state.hp["Goblin"]["main"]).toBe(10);
      expect(state.hp["Dragon"]["main"]).toBe(200);

      // Index-based keys should not exist
      expect(state.initiatives["0"]).toBeUndefined();
      expect(state.initiatives["1"]).toBeUndefined();
    });

    it("handles group HP", () => {
      const block = makeBlock([{ name: "Wolves", ac: 11, hp: { alpha: 30, beta: 25 } }]);

      const state = getDefaultInitiativeState(block);

      expect(state.hp["Wolves"]["alpha"]).toBe(30);
      expect(state.hp["Wolves"]["beta"]).toBe(25);
    });
  });

  describe("mergeInitiativeState", () => {
    it("keeps existing creature state", () => {
      const block = makeBlock([
        { name: "Goblin", ac: 12, hp: 10 },
        { name: "Dragon", ac: 18, hp: 200 },
      ]);

      const saved = {
        activeIndex: 1,
        initiatives: { Goblin: 15, Dragon: 20 },
        hp: { Goblin: { main: 5 }, Dragon: { main: 180 } },
        round: 3,
        consumables: {},
      };

      const merged = mergeInitiativeState(block, saved);

      expect(merged.initiatives["Goblin"]).toBe(15);
      expect(merged.initiatives["Dragon"]).toBe(20);
      expect(merged.hp["Goblin"]["main"]).toBe(5);
      expect(merged.hp["Dragon"]["main"]).toBe(180);
      expect(merged.round).toBe(3);
      expect(merged.activeIndex).toBe(1);
    });

    it("initializes new creatures to max HP", () => {
      const block = makeBlock([
        { name: "Goblin", ac: 12, hp: 10 },
        { name: "Orc", ac: 13, hp: 30 },
      ]);

      const saved = {
        activeIndex: 0,
        initiatives: { Goblin: 15 },
        hp: { Goblin: { main: 5 } },
        round: 2,
        consumables: {},
      };

      const merged = mergeInitiativeState(block, saved);

      // Existing creature keeps state
      expect(merged.hp["Goblin"]["main"]).toBe(5);

      // New creature gets max HP
      expect(merged.hp["Orc"]["main"]).toBe(30);
      expect(merged.initiatives["Orc"]).toBe(0);
    });

    it("drops removed creatures", () => {
      const block = makeBlock([{ name: "Goblin", ac: 12, hp: 10 }]);

      const saved = {
        activeIndex: 0,
        initiatives: { Goblin: 15, Dragon: 20 },
        hp: { Goblin: { main: 5 }, Dragon: { main: 180 } },
        round: 2,
        consumables: {},
      };

      const merged = mergeInitiativeState(block, saved);

      expect(merged.initiatives["Goblin"]).toBe(15);
      expect(merged.initiatives["Dragon"]).toBeUndefined();
      expect(merged.hp["Dragon"]).toBeUndefined();
    });
  });
});
