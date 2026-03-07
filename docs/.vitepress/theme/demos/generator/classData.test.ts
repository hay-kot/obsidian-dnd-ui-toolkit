import { describe, it, expect } from "vitest";
import { classDefinitions } from "./classData";
import { Skills } from "lib/domains/dnd/skills";

const validAbilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

const validSkillNames = Skills.map((s) => s.label);

const expectedClasses = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Artificer",
];

describe("classDefinitions", () => {
  it("contains all 13 D&D 5e classes", () => {
    expect(Object.keys(classDefinitions)).toHaveLength(13);
    for (const name of expectedClasses) {
      expect(classDefinitions[name]).toBeDefined();
    }
  });

  describe.each(expectedClasses)("%s", (className) => {
    const classDef = classDefinitions[className];

    it("has a valid hitDice format", () => {
      expect(classDef.hitDice).toMatch(/^d(6|8|10|12)$/);
    });

    it("has exactly 2 valid saving throws", () => {
      expect(classDef.savingThrows).toHaveLength(2);
      for (const st of classDef.savingThrows) {
        expect(validAbilities).toContain(st);
      }
    });

    it("has skillChoices <= availableSkills.length", () => {
      expect(classDef.skillChoices).toBeLessThanOrEqual(classDef.availableSkills.length);
    });

    it("has only valid skill names in availableSkills", () => {
      for (const skill of classDef.availableSkills) {
        expect(validSkillNames).toContain(skill);
      }
    });

    it("has consistent spellcasting and spell slots", () => {
      if (classDef.spellcastingAbility !== null) {
        expect(classDef.spellSlots.length).toBeGreaterThan(0);
      } else {
        expect(classDef.spellSlots).toHaveLength(0);
      }
    });
  });
});
