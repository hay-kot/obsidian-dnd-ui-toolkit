import { describe, expect, it } from "vitest";
import { readPathValue } from "./attributeCardStateRef";

describe("attributeCardStateRef", () => {
  it("reads nested values by dot path", () => {
    const state = {
      current: 21,
      resources: {
        focus: 7,
      },
    };
    expect(readPathValue(state, "current")).toBe(21);
    expect(readPathValue(state, "resources.focus")).toBe(7);
  });

  it("returns undefined for missing paths", () => {
    const state = { resources: { focus: 7 } };
    expect(readPathValue(state, "resources.investiture")).toBeUndefined();
    expect(readPathValue(state, "foo.bar")).toBeUndefined();
  });
});

