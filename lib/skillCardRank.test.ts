import { describe, it, expect } from "vitest";
import {
  clampSkillRank,
  effectiveSkillRank,
  parseSkillRank,
  rankFromProficiencyString,
} from "./skillCardRank";
import type { SkillItem } from "./types";

const base: SkillItem = { label: "A", ability: "STR", modifier: 0 };

describe("skillCardRank", () => {
  it("clamps rank to 0..5", () => {
    expect(clampSkillRank(-3)).toBe(0);
    expect(clampSkillRank(0)).toBe(0);
    expect(clampSkillRank(2.7)).toBe(2);
    expect(clampSkillRank(5)).toBe(5);
    expect(clampSkillRank(9)).toBe(5);
  });

  it("parseSkillRank only accepts valid numbers", () => {
    expect(parseSkillRank(undefined)).toBeUndefined();
    expect(parseSkillRank(null)).toBeUndefined();
    expect(parseSkillRank("2")).toBe(2);
    expect(parseSkillRank(4)).toBe(4);
    expect(parseSkillRank("x")).toBeUndefined();
  });

  it("rankFromProficiencyString matches legacy mapping", () => {
    expect(rankFromProficiencyString("half")).toBe(2);
    expect(rankFromProficiencyString("proficient")).toBe(3);
    expect(rankFromProficiencyString("expert")).toBe(5);
    expect(rankFromProficiencyString("none")).toBe(0);
    expect(rankFromProficiencyString("unknown")).toBe(0);
    expect(rankFromProficiencyString(undefined)).toBe(0);
    expect(rankFromProficiencyString("nope")).toBe(0);
  });

  it("effectiveSkillRank uses explicit rank when set", () => {
    const item: SkillItem = { ...base, rank: 3, isExpert: true, isProficient: true };
    expect(effectiveSkillRank(item)).toBe(3);
  });

  it("effectiveSkillRank falls back to proficiency flags when rank omitted", () => {
    expect(
      effectiveSkillRank({
        ...base,
        isHalfProficient: true,
      })
    ).toBe(2);
    expect(
      effectiveSkillRank({
        ...base,
        isProficient: true,
      })
    ).toBe(3);
    expect(
      effectiveSkillRank({
        ...base,
        isExpert: true,
      })
    ).toBe(5);
    expect(effectiveSkillRank({ ...base })).toBe(0);
  });
});
