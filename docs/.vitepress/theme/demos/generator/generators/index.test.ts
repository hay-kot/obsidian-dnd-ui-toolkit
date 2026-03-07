import { describe, expect, it } from "vitest";
import type { CharacterData } from "../types";
import { classDefinitions } from "../classData";
import { generateCharacterSheet } from "./index";

function makeCharacterData(overrides?: Partial<CharacterData>): CharacterData {
  return {
    name: "Gandalf",
    className: "Wizard",
    level: 1,
    proficiencyBonus: 2,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 18,
      wisdom: 10,
      charisma: 10,
    },
    skillProficiencies: ["Arcana", "History"],
    savingThrows: ["intelligence", "wisdom"],
    hitDice: "d6",
    baseHP: 6,
    spellcastingAbility: "intelligence",
    spellSlots: [{ level: 1, slots: 2 }],
    classConsumables: [{ label: "Arcane Recovery", uses: 1, resetOn: "long-rest" }],
    ...overrides,
  };
}

describe("generateCharacterSheet", () => {
  it("generates full Wizard output with all sections including spell slots and class features", () => {
    const classDef = classDefinitions["Wizard"];
    const result = generateCharacterSheet(makeCharacterData(), classDef);

    expect(result).toContain("---");
    expect(result).toContain("```badges");
    expect(result).toContain("```event-btns");
    expect(result).toContain("```ability");
    expect(result).toContain("```skills");
    expect(result).toContain("```healthpoints");
    expect(result).toContain("## Spell Slots");
    expect(result).toContain("## Class Features");
    expect(result).toContain("Arcane Recovery");
  });

  it("generates Fighter output with class features but no spell slots", () => {
    const classDef = classDefinitions["Fighter"];
    const data = makeCharacterData({
      className: "Fighter",
      hitDice: "d10",
      baseHP: 10,
      spellcastingAbility: null,
      spellSlots: [],
      savingThrows: ["strength", "constitution"],
      classConsumables: [{ label: "Second Wind", uses: 1, resetOn: ["short-rest", "long-rest"] }],
    });
    const result = generateCharacterSheet(data, classDef);

    expect(result).toContain("```badges");
    expect(result).toContain("```event-btns");
    expect(result).toContain("```ability");
    expect(result).toContain("```skills");
    expect(result).toContain("```healthpoints");
    expect(result).toContain("## Class Features");
    expect(result).toContain("Second Wind");
    expect(result).not.toContain("## Spell Slots");
  });

  it("generates Rogue output with no spell slots and no class features", () => {
    const classDef = classDefinitions["Rogue"];
    const data = makeCharacterData({
      className: "Rogue",
      hitDice: "d8",
      baseHP: 8,
      spellcastingAbility: null,
      spellSlots: [],
      savingThrows: ["dexterity", "intelligence"],
      classConsumables: [],
    });
    const result = generateCharacterSheet(data, classDef);

    expect(result).not.toContain("## Spell Slots");
    expect(result).not.toContain("## Class Features");
  });

  it("starts with frontmatter", () => {
    const classDef = classDefinitions["Wizard"];
    const result = generateCharacterSheet(makeCharacterData(), classDef);

    expect(result).toMatch(/^---/);
  });

  it("ends with a newline", () => {
    const classDef = classDefinitions["Wizard"];
    const result = generateCharacterSheet(makeCharacterData(), classDef);

    expect(result).toMatch(/\n$/);
  });
});
