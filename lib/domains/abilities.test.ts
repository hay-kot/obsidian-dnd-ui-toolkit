import { describe, it, expect, vi } from "vitest";
import {
  parseAbilityBlock,
  parseAbilityBlockFromDocument,
  calculateModifier,
  formatModifier,
  getModifiersForAbility,
  getTotalScore,
  getSavingThrowBonus,
} from "./abilities";
import { GenericBonus } from "../types";

describe("abilities", () => {
  describe("parseAbilityBlock", () => {
    it("should parse basic YAML ability block", () => {
      const yaml = `
abilities:
  strength: 15
  dexterity: 14
  constitution: 13
  intelligence: 12
  wisdom: 10
  charisma: 8
`;
      const result = parseAbilityBlock(yaml);

      expect(result.abilities.strength).toBe(15);
      expect(result.abilities.dexterity).toBe(14);
      expect(result.abilities.constitution).toBe(13);
      expect(result.abilities.intelligence).toBe(12);
      expect(result.abilities.wisdom).toBe(10);
      expect(result.abilities.charisma).toBe(8);
    });

    it("should parse ability block with bonuses", () => {
      const yaml = `
abilities:
  strength: 15
  dexterity: 14
  constitution: 13
  intelligence: 12
  wisdom: 10
  charisma: 8
bonuses:
  - name: "Racial Bonus"
    target: "strength"
    value: 2
  - name: "Magic Item"
    target: "dexterity"
    value: 1
`;
      const result = parseAbilityBlock(yaml);

      expect(result.bonuses).toHaveLength(2);
      expect(result.bonuses[0]).toEqual({
        name: "Racial Bonus",
        target: "strength",
        value: 2,
      });
      expect(result.bonuses[1]).toEqual({
        name: "Magic Item",
        target: "dexterity",
        value: 1,
      });
    });

    it("should parse ability block with bonuses that have modifies field", () => {
      const yaml = `
abilities:
  strength: 15
  dexterity: 14
bonuses:
  - name: "Score Bonus"
    target: "strength"
    value: 2
    modifies: "score"
  - name: "Save Bonus"
    target: "dexterity"
    value: 1
    modifies: "saving_throw"
`;
      const result = parseAbilityBlock(yaml);

      expect(result.bonuses).toHaveLength(2);
      expect(result.bonuses[0]).toEqual({
        name: "Score Bonus",
        target: "strength",
        value: 2,
        modifies: "score",
      });
      expect(result.bonuses[1]).toEqual({
        name: "Save Bonus",
        target: "dexterity",
        value: 1,
        modifies: "saving_throw",
      });
    });

    it("should parse ability block with proficiencies", () => {
      const yaml = `
abilities:
  strength: 15
  dexterity: 14
  constitution: 13
  intelligence: 12
  wisdom: 10
  charisma: 8
proficiencies:
  - "Strength"
  - "Constitution"
`;
      const result = parseAbilityBlock(yaml);

      expect(result.proficiencies).toEqual(["Strength", "Constitution"]);
    });

    it("should use defaults for missing properties", () => {
      const yaml = `
abilities:
  strength: 15
`;
      const result = parseAbilityBlock(yaml);

      expect(result.abilities.strength).toBe(15);
      expect(result.abilities.dexterity).toBe(0);
      expect(result.bonuses).toEqual([]);
      expect(result.proficiencies).toEqual([]);
    });

    it("should handle bonuses without modifies field (backward compatibility)", () => {
      const yaml = `
abilities:
  strength: 15
bonuses:
  - name: "Legacy Bonus"
    target: "strength"
    value: 2
`;
      const result = parseAbilityBlock(yaml);

      expect(result.bonuses).toHaveLength(1);
      expect(result.bonuses[0]).toEqual({
        name: "Legacy Bonus",
        target: "strength",
        value: 2,
      });
      // modifies field should be undefined for backward compatibility
      expect(result.bonuses[0].modifies).toBeUndefined();
    });
  });

  describe("parseAbilityBlockFromDocument", () => {
    it("should extract and parse ability block from document", () => {
      const mockElement = {} as HTMLElement;
      const mockContext = {
        getSectionInfo: vi.fn().mockReturnValue({
          text: `
Some text before

\`\`\`ability
abilities:
  strength: 15
  dexterity: 14
\`\`\`

Some text after
`,
        }),
      } as any;

      const result = parseAbilityBlockFromDocument(mockElement, mockContext);

      expect(result.abilities.strength).toBe(15);
      expect(result.abilities.dexterity).toBe(14);
    });

    it("should handle multiple ability blocks and use the first one", () => {
      const mockElement = {} as HTMLElement;
      const mockContext = {
        getSectionInfo: vi.fn().mockReturnValue({
          text: `
\`\`\`ability
abilities:
  strength: 15
\`\`\`

\`\`\`ability
abilities:
  strength: 10
\`\`\`
`,
        }),
      } as any;

      const result = parseAbilityBlockFromDocument(mockElement, mockContext);

      expect(result.abilities.strength).toBe(15);
    });

    it("should throw error when no ability blocks found", () => {
      const mockElement = {} as HTMLElement;
      const mockContext = {
        getSectionInfo: vi.fn().mockReturnValue({
          text: "No ability blocks here",
        }),
      } as any;

      expect(() => parseAbilityBlockFromDocument(mockElement, mockContext)).toThrow("No ability code blocks found");
    });

    it("should handle empty section info", () => {
      const mockElement = {} as HTMLElement;
      const mockContext = {
        getSectionInfo: vi.fn().mockReturnValue(null),
      } as any;

      expect(() => parseAbilityBlockFromDocument(mockElement, mockContext)).toThrow("No ability code blocks found");
    });
  });

  describe("calculateModifier", () => {
    it("should calculate standard D&D 5e modifiers", () => {
      expect(calculateModifier(1)).toBe(-5);
      expect(calculateModifier(8)).toBe(-1);
      expect(calculateModifier(9)).toBe(-1);
      expect(calculateModifier(10)).toBe(0);
      expect(calculateModifier(11)).toBe(0);
      expect(calculateModifier(12)).toBe(1);
      expect(calculateModifier(13)).toBe(1);
      expect(calculateModifier(14)).toBe(2);
      expect(calculateModifier(15)).toBe(2);
      expect(calculateModifier(16)).toBe(3);
      expect(calculateModifier(17)).toBe(3);
      expect(calculateModifier(18)).toBe(4);
      expect(calculateModifier(20)).toBe(5);
      expect(calculateModifier(30)).toBe(10);
    });
  });

  describe("formatModifier", () => {
    it("should format positive modifiers with + sign", () => {
      expect(formatModifier(0)).toBe("+0");
      expect(formatModifier(1)).toBe("+1");
      expect(formatModifier(5)).toBe("+5");
    });

    it("should format negative modifiers with - sign", () => {
      expect(formatModifier(-1)).toBe("-1");
      expect(formatModifier(-5)).toBe("-5");
    });
  });

  describe("getModifiersForAbility", () => {
    const testModifiers: GenericBonus[] = [
      { name: "Strength Bonus", target: "strength", value: 2 },
      { name: "Dex Bonus", target: "dexterity", value: 1 },
      { name: "Another Strength", target: "strength", value: 1 },
      { name: "Wisdom Bonus", target: "wisdom", value: 3 },
    ];

    it("should return modifiers for specific ability", () => {
      const strengthMods = getModifiersForAbility(testModifiers, "strength");

      expect(strengthMods).toHaveLength(2);
      expect(strengthMods[0].name).toBe("Strength Bonus");
      expect(strengthMods[1].name).toBe("Another Strength");
    });

    it("should return empty array for ability with no modifiers", () => {
      const charismaMods = getModifiersForAbility(testModifiers, "charisma");

      expect(charismaMods).toHaveLength(0);
    });

    it("should handle empty modifiers array", () => {
      const result = getModifiersForAbility([], "strength");

      expect(result).toHaveLength(0);
    });
  });

  describe("getTotalScore", () => {
    const testModifiers: GenericBonus[] = [
      { name: "Strength Bonus", target: "strength", value: 2 },
      { name: "Dex Bonus", target: "dexterity", value: 1 },
      { name: "Another Strength", target: "strength", value: 1 },
      { name: "Negative Modifier", target: "strength", value: -1 },
    ];

    it("should calculate total score with modifiers (backward compatibility)", () => {
      const total = getTotalScore(15, "strength", testModifiers);

      // Base 15 + 2 + 1 + (-1) = 17 (all modifiers default to score modification)
      expect(total).toBe(17);
    });

    it("should return base score when no modifiers apply", () => {
      const total = getTotalScore(12, "charisma", testModifiers);

      expect(total).toBe(12);
    });

    it("should handle empty modifiers array", () => {
      const total = getTotalScore(14, "strength", []);

      expect(total).toBe(14);
    });

    it("should handle negative base scores", () => {
      const total = getTotalScore(-5, "strength", testModifiers);

      // Base -5 + 2 + 1 + (-1) = -3
      expect(total).toBe(-3);
    });

    it("should only apply score modifiers to total score", () => {
      const mixedModifiers: GenericBonus[] = [
        { name: "Score Bonus", target: "strength", value: 2, modifies: "score" },
        { name: "Saving Throw Bonus", target: "strength", value: 3, modifies: "saving_throw" },
        { name: "Default Bonus", target: "strength", value: 1 }, // Should default to score
      ];

      const total = getTotalScore(15, "strength", mixedModifiers);

      // Base 15 + 2 (score) + 1 (default to score) = 18
      // Saving throw bonus (3) should not be included
      expect(total).toBe(18);
    });
  });

  describe("getSavingThrowBonus", () => {
    const mixedModifiers: GenericBonus[] = [
      { name: "Score Bonus", target: "strength", value: 2, modifies: "score" },
      { name: "Saving Throw Bonus", target: "strength", value: 3, modifies: "saving_throw" },
      { name: "Another Save Bonus", target: "strength", value: 1, modifies: "saving_throw" },
      { name: "Default Bonus", target: "strength", value: 4 }, // Should default to saving_throw
      { name: "Dex Save Bonus", target: "dexterity", value: 2, modifies: "saving_throw" },
    ];

    it("should calculate saving throw bonus from saving throw modifiers", () => {
      const bonus = getSavingThrowBonus("strength", mixedModifiers);

      // 3 + 1 + 4 (default to saving_throw) = 8
      // Score bonus (2) should not be included
      expect(bonus).toBe(8);
    });

    it("should return 0 when no saving throw modifiers apply", () => {
      const bonus = getSavingThrowBonus("charisma", mixedModifiers);

      expect(bonus).toBe(0);
    });

    it("should handle empty modifiers array", () => {
      const bonus = getSavingThrowBonus("strength", []);

      expect(bonus).toBe(0);
    });

    it("should handle only score modifiers (no saving throw bonuses)", () => {
      const scoreOnlyModifiers: GenericBonus[] = [
        { name: "Score Bonus 1", target: "strength", value: 2, modifies: "score" },
        { name: "Score Bonus 2", target: "strength", value: 1, modifies: "score" },
      ];

      const bonus = getSavingThrowBonus("strength", scoreOnlyModifiers);

      expect(bonus).toBe(0);
    });

    it("should default modifies field to saving_throw for backward compatibility", () => {
      const legacyModifiers: GenericBonus[] = [
        { name: "Legacy Bonus 1", target: "strength", value: 2 },
        { name: "Legacy Bonus 2", target: "strength", value: 1 },
      ];

      const bonus = getSavingThrowBonus("strength", legacyModifiers);

      // Both should default to saving_throw: 2 + 1 = 3
      expect(bonus).toBe(3);
    });
  });
});
