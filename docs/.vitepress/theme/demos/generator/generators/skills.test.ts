import { describe, it, expect } from "vitest";
import { generateSkills } from "./skills";
import type { CharacterData } from "../types";

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

describe("generateSkills", () => {
  it("lists selected proficiencies in lowercase", () => {
    const data = makeCharacterData({
      skillProficiencies: ["Arcana", "History", "Perception"],
    });
    const result = generateSkills(data);
    expect(result).toContain("- arcana");
    expect(result).toContain("- history");
    expect(result).toContain("- perception");
  });

  it("produces empty array syntax when no proficiencies selected", () => {
    const data = makeCharacterData({ skillProficiencies: [] });
    const result = generateSkills(data);
    expect(result).toContain("proficiencies:\n  []");
  });

  it("wraps output in skills code fences", () => {
    const result = generateSkills(makeCharacterData());
    expect(result).toMatch(/^```skills\n/);
    expect(result).toMatch(/\n```$/);
  });
});
