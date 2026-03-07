import { describe, expect, it } from "vitest";
import { generateEventButtons } from "./eventButtons";

describe("generateEventButtons", () => {
  it("contains Short Rest and Long Rest names", () => {
    const result = generateEventButtons();

    expect(result).toContain("Short Rest");
    expect(result).toContain("Long Rest");
  });

  it("starts with event-btns code fence and ends with closing fence", () => {
    const result = generateEventButtons();

    expect(result).toMatch(/^```event-btns\n/);
    expect(result).toMatch(/\n```$/);
  });

  it("contains short-rest and long-rest values", () => {
    const result = generateEventButtons();

    expect(result).toContain("value: short-rest");
    expect(result).toContain("value: long-rest");
  });
});
