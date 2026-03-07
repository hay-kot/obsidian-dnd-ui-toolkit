import { describe, it, expect } from "vitest";
import { generateAbilities } from "./abilities";
import type { CharacterData, ClassDefinition } from "../types";

function makeCharacterData(overrides?: Partial<CharacterData>): CharacterData {
  return {
    name: "Test",
    className: "Fighter",
    level: 1,
    proficiencyBonus: 2,
    abilities: {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
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

describe("generateAbilities", () => {
  it("includes all 6 ability scores", () => {
    const data = makeCharacterData();
    const result = generateAbilities(data, makeClassDef());
    expect(result).toContain("strength: 15");
    expect(result).toContain("dexterity: 14");
    expect(result).toContain("constitution: 13");
    expect(result).toContain("intelligence: 12");
    expect(result).toContain("wisdom: 10");
    expect(result).toContain("charisma: 8");
  });

  it("lists saving throw proficiencies from class definition", () => {
    const classDef = makeClassDef({
      savingThrows: ["intelligence", "wisdom"],
    });
    const result = generateAbilities(makeCharacterData(), classDef);
    expect(result).toContain("- intelligence");
    expect(result).toContain("- wisdom");
  });

  it("wraps output in ability code fences", () => {
    const result = generateAbilities(makeCharacterData(), makeClassDef());
    expect(result).toMatch(/^```ability\n/);
    expect(result).toMatch(/\n```$/);
  });
});
