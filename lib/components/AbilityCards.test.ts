import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AbilityCards from "./AbilityCards.vue";

describe("AbilityCards", () => {
  it("renders ability cards", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [
          { label: "STR", total: 16, modifier: "+3", isProficient: false, savingThrow: "+3" },
          { label: "DEX", total: 14, modifier: "+2", isProficient: true, savingThrow: "+5" },
        ],
      },
    });

    expect(wrapper.findAll(".dnd-ui-ability-score-card")).toHaveLength(2);
    expect(wrapper.text()).toContain("STR");
    expect(wrapper.text()).toContain("16");
    expect(wrapper.text()).toContain("+3");
  });

  it("applies proficient class", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [{ label: "DEX", total: 14, modifier: "+2", isProficient: true, savingThrow: "+5" }],
      },
    });

    const card = wrapper.find(".dnd-ui-ability-score-card");
    expect(card.classes()).toContain("dnd-ui-proficient");
  });

  it("does not apply proficient class when not proficient", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [{ label: "STR", total: 10, modifier: "+0", isProficient: false, savingThrow: "+0" }],
      },
    });

    const card = wrapper.find(".dnd-ui-ability-score-card");
    expect(card.classes()).not.toContain("dnd-ui-proficient");
  });

  it("displays saving throw value", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [{ label: "WIS", total: 12, modifier: "+1", isProficient: false, savingThrow: "+1" }],
      },
    });

    expect(wrapper.text()).toContain("Saving +1");
  });
});
