import { describe, it, expect } from "vitest";
import { mergeWithDefaults } from "./utils";

describe("mergeWithDefaults", () => {
  it("should handle null/undefined sources and return defaults copy", () => {
    const defaults = { name: "default", value: 42, enabled: false };

    const nullResult = mergeWithDefaults(null, defaults);
    const undefinedResult = mergeWithDefaults(undefined, defaults);

    expect(nullResult).toEqual(defaults);
    expect(undefinedResult).toEqual(defaults);
    expect(nullResult).not.toBe(defaults); // Should be a copy
  });

  it("should merge nested objects recursively while preserving arrays", () => {
    const defaults = {
      user: {
        profile: { name: "default", avatar: null },
        settings: { theme: "light", notifications: true },
      },
      items: ["default1", "default2"],
      version: "1.0",
    };

    const source: any = {
      user: {
        profile: { name: "John" },
        settings: { theme: "dark" },
      },
      items: ["override1"],
    };

    const result = mergeWithDefaults(source, defaults);

    expect(result).toEqual({
      user: {
        profile: { name: "John", avatar: null },
        settings: { theme: "dark", notifications: true },
      },
      items: ["override1"], // Arrays replaced, not merged
      version: "1.0",
    });
  });

  it("should handle null/undefined values in source by falling back to defaults", () => {
    const defaults = {
      config: { theme: "light", size: "medium" },
      name: "default",
      count: 42,
    };

    const source = {
      config: null as any,
      name: undefined,
      count: 0,
    };

    const result = mergeWithDefaults(source, defaults);

    expect(result).toEqual({
      config: { theme: "light", size: "medium" }, // Null object falls back to default
      name: "default", // Undefined falls back to default
      count: 0, // Zero is preserved
    });
  });
});
