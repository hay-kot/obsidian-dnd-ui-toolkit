import { describe, it, expect } from "vitest";
import {
  isProficiencyBonusInFrontmatter,
  levelToProficiencyBonus,
  anyIntoFrontMatter,
  UnparsedFrontmatter,
} from "./frontmatter";

describe("frontmatter", () => {
  describe("isProficiencyBonusInFrontmatter", () => {
    const testCases = [
      // Should return true cases
      { input: { proficiencyBonus: 3 }, expected: true, description: "proficiencyBonus is present" },
      { input: { "Proficiency Bonus": 3 }, expected: true, description: "Proficiency Bonus is present" },
      { input: { proficiency_bonus: 3 }, expected: true, description: "proficiency_bonus is present" },
      { input: { proficiencybonus: 3 }, expected: true, description: "lowercase variant is present" },
      { input: { "proficiency bonus": 3 }, expected: true, description: "lowercase 'proficiency bonus' is present" },
      { input: { proficiencyBonus: 0 }, expected: true, description: "values of 0 correctly" },

      // Should return false cases
      {
        input: { level: 5, name: "Test Character" },
        expected: false,
        description: "no proficiency bonus keys are present",
      },
      { input: {}, expected: false, description: "frontmatter is empty" },
      { input: null, expected: false, description: "frontmatter is null" },
      { input: undefined, expected: false, description: "frontmatter is undefined" },
      { input: { proficiencyBonus: null }, expected: false, description: "null values correctly" },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should return ${expected} when ${description}`, () => {
        expect(isProficiencyBonusInFrontmatter(input)).toBe(expected);
      });
    });
  });

  describe("levelToProficiencyBonus", () => {
    const testCases = [
      // Levels 1-4: Proficiency bonus 2
      { input: 1, expected: 2, description: "level 1" },
      { input: 2, expected: 2, description: "level 2" },
      { input: 3, expected: 2, description: "level 3" },
      { input: 4, expected: 2, description: "level 4" },

      // Levels 5-8: Proficiency bonus 3
      { input: 5, expected: 3, description: "level 5" },
      { input: 6, expected: 3, description: "level 6" },
      { input: 7, expected: 3, description: "level 7" },
      { input: 8, expected: 3, description: "level 8" },

      // Levels 9-12: Proficiency bonus 4
      { input: 9, expected: 4, description: "level 9" },
      { input: 10, expected: 4, description: "level 10" },
      { input: 11, expected: 4, description: "level 11" },
      { input: 12, expected: 4, description: "level 12" },

      // Levels 13-16: Proficiency bonus 5
      { input: 13, expected: 5, description: "level 13" },
      { input: 14, expected: 5, description: "level 14" },
      { input: 15, expected: 5, description: "level 15" },
      { input: 16, expected: 5, description: "level 16" },

      // Levels 17-20: Proficiency bonus 6
      { input: 17, expected: 6, description: "level 17" },
      { input: 18, expected: 6, description: "level 18" },
      { input: 19, expected: 6, description: "level 19" },
      { input: 20, expected: 6, description: "level 20" },

      // Edge cases
      { input: 0, expected: 2, description: "level 0" },
      { input: -1, expected: 2, description: "negative level" },
      { input: 25, expected: 6, description: "level above 20" },
      { input: 100, expected: 6, description: "very high level" },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should return ${expected} for ${description}`, () => {
        expect(levelToProficiencyBonus(input)).toBe(expected);
      });
    });
  });

  describe("anyIntoFrontMatter", () => {
    it("should return default frontmatter for empty input", () => {
      const fm: UnparsedFrontmatter = {};
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(2);
    });

    it("should parse proficiencyBonus correctly", () => {
      const fm: UnparsedFrontmatter = { proficiencyBonus: 4 };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(4);
    });

    it("should parse level correctly", () => {
      const fm: UnparsedFrontmatter = { level: 10 };
      const result = anyIntoFrontMatter(fm);

      expect(result.level).toBe(10);
    });

    it("should parse string numbers correctly", () => {
      const fm: UnparsedFrontmatter = {
        proficiencyBonus: "3",
        level: "8",
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(3);
      expect(result.level).toBe(8);
    });

    it("should handle lowercase keys", () => {
      const fm: UnparsedFrontmatter = {
        proficiencybonus: 5,
        level: 12,
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(5);
      expect(result.level).toBe(12);
    });

    it("should auto-calculate proficiency bonus from level when not explicitly set", () => {
      const fm: UnparsedFrontmatter = { level: 9 };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(4);
      expect(result.level).toBe(9);
    });

    it("should not auto-calculate when proficiency bonus is explicitly set", () => {
      const fm: UnparsedFrontmatter = {
        level: 9,
        proficiencyBonus: 2,
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(2);
      expect(result.level).toBe(9);
    });

    it("should preserve other frontmatter properties", () => {
      const fm: UnparsedFrontmatter = {
        level: 5,
        name: "Test Character",
        class: "Fighter",
        hitPoints: 45,
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.level).toBe(5);
      expect(result.proficiency_bonus).toBe(3);
      expect(result.name).toBe("Test Character");
      expect(result.class).toBe("Fighter");
      expect(result.hitPoints).toBe(45);
    });

    it("should handle mixed case aliases", () => {
      const fm: UnparsedFrontmatter = {
        "Proficiency Bonus": 4,
        Level: 8,
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(4);
      expect(result.level).toBe(8);
    });

    it("should prioritize first matching key found", () => {
      const fm: UnparsedFrontmatter = {
        proficiencyBonus: 3,
        "Proficiency Bonus": 4,
        proficiency_bonus: 5,
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.proficiency_bonus).toBe(3);
    });

    it("should handle non-numeric string values", () => {
      const fm: UnparsedFrontmatter = {
        level: 5,
        name: "not a number",
        description: "123abc",
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.level).toBe(5);
      expect(result.name).toBe("not a number");
      expect(result.description).toBe("123abc");
    });

    it("should handle complex nested objects", () => {
      const fm: UnparsedFrontmatter = {
        level: 3,
        stats: {
          str: 16,
          dex: 14,
        },
        equipment: ["sword", "shield"],
      };
      const result = anyIntoFrontMatter(fm);

      expect(result.level).toBe(3);
      expect(result.proficiency_bonus).toBe(2);
      expect(result.stats).toEqual({ str: 16, dex: 14 });
      expect(result.equipment).toEqual(["sword", "shield"]);
    });
  });
});
