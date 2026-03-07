import { describe, expect, it } from "vitest";
import type { CharacterData, ClassDefinition } from "../types";
import { generateBadges } from "./badges";

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

describe("generateBadges", () => {
  it("generates 3 items for non-caster (Fighter)", () => {
    const result = generateBadges(makeCharacterData(), makeClassDef());

    expect(result).toContain("label: Level");
    expect(result).toContain("label: Initiative");
    expect(result).toContain("label: AC");
    expect(result).not.toContain("Spell Save");
    expect(result).not.toContain("Spell Attack");

    const itemMatches = result.match(/- label:/g);
    expect(itemMatches).toHaveLength(3);
  });

  it("generates 5 items for caster (Wizard) with intelligence", () => {
    const result = generateBadges(
      makeCharacterData({ spellcastingAbility: "intelligence" }),
      makeClassDef({ spellcastingAbility: "intelligence" })
    );

    const itemMatches = result.match(/- label:/g);
    expect(itemMatches).toHaveLength(5);
    expect(result).toContain("Spell Save");
    expect(result).toContain("Spell Attack");
    expect(result).toContain("abilities.intelligence");
  });

  it("uses Barbarian AC template with constitution", () => {
    const acTemplate = "{{ add 10 (modifier abilities.dexterity) (modifier abilities.constitution) }}";
    const result = generateBadges(makeCharacterData(), makeClassDef({ acTemplate }));

    expect(result).toContain("modifier abilities.constitution");
    expect(result).toContain("modifier abilities.dexterity");
  });

  it("uses Monk AC template with wisdom", () => {
    const acTemplate = "{{ add 10 (modifier abilities.dexterity) (modifier abilities.wisdom) }}";
    const result = generateBadges(makeCharacterData(), makeClassDef({ acTemplate }));

    expect(result).toContain("modifier abilities.wisdom");
    expect(result).toContain("modifier abilities.dexterity");
  });

  it("uses default AC template when acTemplate is null", () => {
    const result = generateBadges(makeCharacterData(), makeClassDef({ acTemplate: null }));

    expect(result).toContain("{{ add 10 (modifier abilities.dexterity) }}");
  });

  it("wraps output in badges code fences", () => {
    const result = generateBadges(makeCharacterData(), makeClassDef());

    expect(result).toMatch(/^```badges\n/);
    expect(result).toMatch(/\n```$/);
  });
});
