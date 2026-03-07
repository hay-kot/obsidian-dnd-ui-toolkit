import { describe, it, expect } from "vitest";
import type { CharacterData } from "../types";
import { generateFrontmatter } from "./frontmatter";

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

describe("generateFrontmatter", () => {
  it("starts with --- and ends with ---", () => {
    const result = generateFrontmatter(makeCharacterData());
    const lines = result.split("\n");
    expect(lines[0]).toBe("---");
    expect(lines[lines.length - 1]).toBe("---");
  });

  it("contains proficiency_bonus: 2", () => {
    const result = generateFrontmatter(makeCharacterData());
    expect(result).toContain("proficiency_bonus: 2");
  });

  it("contains level: 1", () => {
    const result = generateFrontmatter(makeCharacterData());
    expect(result).toContain("level: 1");
  });

  it("has exactly 4 lines", () => {
    const result = generateFrontmatter(makeCharacterData());
    const lines = result.split("\n");
    expect(lines).toHaveLength(4);
  });
});
