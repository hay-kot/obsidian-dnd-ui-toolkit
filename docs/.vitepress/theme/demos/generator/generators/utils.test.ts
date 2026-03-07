import { describe, it, expect } from "vitest";
import { sanitizeStateKey } from "./utils";

describe("sanitizeStateKey", () => {
  it("converts spaces to underscores and lowercases", () => {
    expect(sanitizeStateKey("Din the Wizard")).toBe("din_the_wizard");
  });

  it("returns 'char' for empty string", () => {
    expect(sanitizeStateKey("")).toBe("char");
  });

  it("strips non-alphanumeric characters", () => {
    expect(sanitizeStateKey("Special!@#Characters")).toBe("special_characters");
  });

  it("trims leading and trailing underscores from whitespace", () => {
    expect(sanitizeStateKey("  leading trailing  ")).toBe("leading_trailing");
  });

  it("preserves numeric-only names", () => {
    expect(sanitizeStateKey("123")).toBe("123");
  });
});
