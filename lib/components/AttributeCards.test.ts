import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AttributeCards from "./AttributeCards.vue";
import type { AttributeCardsBlock } from "../types";

const sample: AttributeCardsBlock = {
  heading: "Attributes",
  realms: [
    {
      label: "Physical",
      primary: { label: "Strength", label_short: "STR", header_value: "+1", value: "0" },
      defense: { label: "Physical defense", label_short: "PDEF", header_value: 0, value: "0" },
      secondary: { label: "Speed", label_short: "SPD", header_value: 0, value: "0" },
      resources: [
        { label: "Health (maximum)", value: 10 },
        { label: "Health (current)", value: 8 },
        { label: "Deflect", value: "0" },
      ],
    },
    {
      label: "Cognitive",
      primary: { label: "Intellect", label_short: "INT", value: "0" },
      defense: { label: "Cognitive defense", value: "0" },
      secondary: { label: "Willpower", label_short: "WIL", value: "0" },
      resources: [
        { label: "Focus (maximum)", value: 3 },
        { label: "Focus (current)", value: 2 },
      ],
    },
  ],
};

describe("AttributeCards", () => {
  it("renders heading, realm titles, and main attribute labels", () => {
    const wrapper = mount(AttributeCards, { props: { data: sample } });
    const text = wrapper.text();
    expect(text).toContain("Attributes");
    expect(text).toContain("Physical");
    expect(text).toContain("Cognitive");
    expect(text).toContain("STR");
    expect(text).toContain("PDEF");
    expect(text).toContain("SPD");
    expect(text).toContain("Deflect");
  });

  it("applies shield styling to the defense cell", () => {
    const wrapper = mount(AttributeCards, { props: { data: sample } });
    expect(wrapper.findAll(".dnd-ui-attribute-shield").length).toBeGreaterThanOrEqual(1);
  });

  it("renders resource track cards", () => {
    const wrapper = mount(AttributeCards, { props: { data: sample } });
    expect(wrapper.findAll(".dnd-ui-attribute-resource-card").length).toBe(5);
  });
});
