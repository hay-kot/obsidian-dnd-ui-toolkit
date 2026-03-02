import { describe, it, expect } from "vitest";
import { calculateModifier, formatModifier } from "./modifiers";

describe("D&D modifiers", () => {
  it("calculates modifier from score", () => {
    expect(calculateModifier(10)).toBe(0);
    expect(calculateModifier(16)).toBe(3);
    expect(calculateModifier(8)).toBe(-1);
    expect(calculateModifier(1)).toBe(-5);
    expect(calculateModifier(20)).toBe(5);
  });

  it("formats modifier with sign", () => {
    expect(formatModifier(3)).toBe("+3");
    expect(formatModifier(0)).toBe("+0");
    expect(formatModifier(-2)).toBe("-2");
  });
});
