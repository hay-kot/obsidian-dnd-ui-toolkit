import { describe, it, expect } from "vitest";
import { generateHealthpoints } from "./healthpoints";
import type { CharacterData, ClassDefinition } from "../types";

function makeCharacterData(overrides?: Partial<CharacterData>): CharacterData {
  return {
    name: "Test",
    className: "Fighter",
    level: 1,
    proficiencyBonus: 2,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skillProficiencies: [],
    savingThrows: ["strength", "constitution"],
    hitDice: "d10",
    baseHP: 10,
    spellcastingAbility: null,
    spellSlots: [],
    classConsumables: [],
    ...overrides,
  };
}

function makeClassDef(overrides?: Partial<ClassDefinition>): ClassDefinition {
  return {
    name: "Fighter",
    hitDice: "d10",
    baseHP: 10,
    savingThrows: ["strength", "constitution"],
    skillChoices: 2,
    availableSkills: ["Athletics", "Perception"],
    spellcastingAbility: null,
    spellSlots: [],
    classConsumables: [],
    acTemplate: null,
    ...overrides,
  };
}

describe("generateHealthpoints", () => {
  it("uses baseHP when CON modifier is 0 (CON 10)", () => {
    const result = generateHealthpoints(makeCharacterData(), makeClassDef());
    expect(result).toContain("health: 10");
  });

  it("adds positive CON modifier to baseHP (CON 14, mod +2)", () => {
    const data = makeCharacterData({
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 14,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const result = generateHealthpoints(data, makeClassDef());
    expect(result).toContain("health: 12");
  });

  it("subtracts negative CON modifier from baseHP (CON 8, mod -1)", () => {
    const data = makeCharacterData({
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 8,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const result = generateHealthpoints(data, makeClassDef());
    expect(result).toContain("health: 9");
  });

  it("clamps HP to minimum of 1 (CON 1, Sorcerer baseHP 6)", () => {
    const data = makeCharacterData({
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 1,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const classDef = makeClassDef({ baseHP: 6, hitDice: "d6" });
    const result = generateHealthpoints(data, classDef);
    expect(result).toContain("health: 1");
  });

  it("derives state_key from character name", () => {
    const data = makeCharacterData({ name: "Gandalf the Grey" });
    const result = generateHealthpoints(data, makeClassDef());
    expect(result).toContain("state_key: gandalf_the_grey_health");
  });

  it("includes hitdice with correct dice type", () => {
    const classDef = makeClassDef({ hitDice: "d8" });
    const result = generateHealthpoints(makeCharacterData(), classDef);
    expect(result).toContain("dice: d8");
    expect(result).toContain("value: 1");
  });

  it("wraps output in healthpoints code fences", () => {
    const result = generateHealthpoints(makeCharacterData(), makeClassDef());
    expect(result).toMatch(/^```healthpoints\n/);
    expect(result).toMatch(/\n```$/);
  });
});
