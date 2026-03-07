import { describe, expect, it } from "vitest";
import type { CharacterData, ClassDefinition } from "../types";
import { generateSpellSlots, generateClassConsumables } from "./consumables";

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

function makeClassDef(overrides?: Partial<ClassDefinition>): ClassDefinition {
  return {
    name: "Wizard",
    hitDice: "d6",
    baseHP: 6,
    savingThrows: ["intelligence", "wisdom"],
    skillChoices: 2,
    availableSkills: ["Arcana", "History"],
    spellcastingAbility: "intelligence",
    spellSlots: [{ level: 1, slots: 2 }],
    classConsumables: [{ label: "Arcane Recovery", uses: 1, resetOn: "long-rest" }],
    acTemplate: null,
    ...overrides,
  };
}

describe("generateSpellSlots", () => {
  it("generates consumable block for Wizard with Level 1 spell slots", () => {
    const result = generateSpellSlots(makeCharacterData(), makeClassDef());

    expect(result).not.toBeNull();
    expect(result).toContain('"Level 1"');
    expect(result).toContain("uses: 2");
    expect(result).toContain("reset_on: long-rest");
  });

  it("uses short-rest and long-rest reset for Warlock", () => {
    const result = generateSpellSlots(
      makeCharacterData(),
      makeClassDef({
        spellSlots: [{ level: 1, slots: 1 }],
        spellSlotResetOn: ["short-rest", "long-rest"],
      })
    );

    expect(result).not.toBeNull();
    expect(result).toContain("reset_on:");
    expect(result).toContain("      - short-rest");
    expect(result).toContain("      - long-rest");
  });

  it("returns null for Fighter with no spell slots", () => {
    const result = generateSpellSlots(makeCharacterData(), makeClassDef({ spellSlots: [] }));

    expect(result).toBeNull();
  });

  it("includes character name prefix in state key", () => {
    const result = generateSpellSlots(makeCharacterData(), makeClassDef());

    expect(result).toContain("state_key: gandalf_spells_1");
  });

  it("wraps output in consumable code fences", () => {
    const result = generateSpellSlots(makeCharacterData(), makeClassDef())!;

    expect(result).toMatch(/^```consumable\n/);
    expect(result).toMatch(/\n```$/);
  });
});

describe("generateClassConsumables", () => {
  it("generates Wizard Arcane Recovery with 1 use and long-rest", () => {
    const result = generateClassConsumables(makeCharacterData(), makeClassDef());

    expect(result).not.toBeNull();
    expect(result).toContain("label: Arcane Recovery");
    expect(result).toContain("uses: 1");
    expect(result).toContain("reset_on: long-rest");
  });

  it("generates Fighter Second Wind with reset_on array", () => {
    const result = generateClassConsumables(
      makeCharacterData({ name: "Conan" }),
      makeClassDef({
        classConsumables: [{ label: "Second Wind", uses: 1, resetOn: ["short-rest", "long-rest"] }],
      })
    );

    expect(result).not.toBeNull();
    expect(result).toContain("label: Second Wind");
    expect(result).toContain("uses: 1");
    expect(result).toContain("      - short-rest");
    expect(result).toContain("      - long-rest");
  });

  it("generates Barbarian Rage with 2 uses and long-rest", () => {
    const result = generateClassConsumables(
      makeCharacterData({ name: "Grog" }),
      makeClassDef({
        classConsumables: [{ label: "Rage", uses: 2, resetOn: "long-rest" }],
      })
    );

    expect(result).not.toBeNull();
    expect(result).toContain("label: Rage");
    expect(result).toContain("uses: 2");
    expect(result).toContain("reset_on: long-rest");
  });

  it("quotes template string uses for Bard Bardic Inspiration", () => {
    const result = generateClassConsumables(
      makeCharacterData({ name: "Scanlan" }),
      makeClassDef({
        classConsumables: [
          {
            label: "Bardic Inspiration",
            uses: "{{ modifier abilities.charisma }}",
            resetOn: "long-rest",
          },
        ],
      })
    );

    expect(result).not.toBeNull();
    expect(result).toContain("uses: '{{ modifier abilities.charisma }}'");
  });

  it("returns null for class with no consumables", () => {
    const result = generateClassConsumables(makeCharacterData(), makeClassDef({ classConsumables: [] }));

    expect(result).toBeNull();
  });

  it("includes character name prefix in state key", () => {
    const result = generateClassConsumables(makeCharacterData(), makeClassDef());

    expect(result).toContain("state_key: gandalf_arcane_recovery");
  });

  it("wraps output in consumable code fences", () => {
    const result = generateClassConsumables(makeCharacterData(), makeClassDef())!;

    expect(result).toMatch(/^```consumable\n/);
    expect(result).toMatch(/\n```$/);
  });
});
