import { describe, it, expect, beforeEach } from "vitest";
import { BaseView } from "./BaseView";
import { App } from "obsidian";

class TestView extends BaseView {
  public codeblock = "test";

  public render(): string {
    return "";
  }

  public testCalculateProficiencyBonus(level: number): number {
    return (this as any).calculateProficiencyBonus(level);
  }

  public testHasProficiencyBonusInFrontmatter(fm: any): boolean {
    return (this as any).hasProficiencyBonusInFrontmatter(fm);
  }
}

describe("BaseView proficiency bonus calculation", () => {
  let testView: TestView;

  beforeEach(() => {
    testView = new TestView({} as App);
  });

  describe("calculateProficiencyBonus", () => {
    it("should return +2 for levels 1-4", () => {
      expect(testView.testCalculateProficiencyBonus(1)).toBe(2);
      expect(testView.testCalculateProficiencyBonus(2)).toBe(2);
      expect(testView.testCalculateProficiencyBonus(3)).toBe(2);
      expect(testView.testCalculateProficiencyBonus(4)).toBe(2);
    });

    it("should return +3 for levels 5-8", () => {
      expect(testView.testCalculateProficiencyBonus(5)).toBe(3);
      expect(testView.testCalculateProficiencyBonus(6)).toBe(3);
      expect(testView.testCalculateProficiencyBonus(7)).toBe(3);
      expect(testView.testCalculateProficiencyBonus(8)).toBe(3);
    });

    it("should return +4 for levels 9-12", () => {
      expect(testView.testCalculateProficiencyBonus(9)).toBe(4);
      expect(testView.testCalculateProficiencyBonus(10)).toBe(4);
      expect(testView.testCalculateProficiencyBonus(11)).toBe(4);
      expect(testView.testCalculateProficiencyBonus(12)).toBe(4);
    });

    it("should return +5 for levels 13-16", () => {
      expect(testView.testCalculateProficiencyBonus(13)).toBe(5);
      expect(testView.testCalculateProficiencyBonus(14)).toBe(5);
      expect(testView.testCalculateProficiencyBonus(15)).toBe(5);
      expect(testView.testCalculateProficiencyBonus(16)).toBe(5);
    });

    it("should return +6 for levels 17-20", () => {
      expect(testView.testCalculateProficiencyBonus(17)).toBe(6);
      expect(testView.testCalculateProficiencyBonus(18)).toBe(6);
      expect(testView.testCalculateProficiencyBonus(19)).toBe(6);
      expect(testView.testCalculateProficiencyBonus(20)).toBe(6);
    });
  });

  describe("hasProficiencyBonusInFrontmatter", () => {
    it("should return true when proficiencyBonus is set", () => {
      expect(testView.testHasProficiencyBonusInFrontmatter({ proficiencyBonus: 3 })).toBe(true);
    });

    it("should return true when proficiency_bonus is set", () => {
      expect(testView.testHasProficiencyBonusInFrontmatter({ proficiency_bonus: 3 })).toBe(true);
    });

    it("should return true when Proficiency Bonus is set", () => {
      expect(testView.testHasProficiencyBonusInFrontmatter({ "Proficiency Bonus": 3 })).toBe(true);
    });

    it("should return false when no proficiency bonus keys are set", () => {
      expect(testView.testHasProficiencyBonusInFrontmatter({ level: 5 })).toBe(false);
      expect(testView.testHasProficiencyBonusInFrontmatter({})).toBe(false);
    });
  });
});
