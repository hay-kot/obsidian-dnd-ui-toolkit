import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setTooltip } from "obsidian";
import AbilityCards from "./AbilityCards.vue";

describe("AbilityCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("marks advantage with an icon and an instant tooltip", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [
          { label: "STR", total: 15, modifier: "+2", isProficient: true, savingThrow: "+5", hasAdvantage: true },
        ],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.classes()).toContain("dnd-ui-advantage");
    expect(indicator.find(".svg-icon").attributes("data-icon")).toBe("chevrons-up");
    expect(setTooltip).toHaveBeenCalledWith(expect.anything(), "Advantage on STR saving throws", { delay: 0 });
  });

  it("marks disadvantage with an icon and an instant tooltip", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [
          { label: "CON", total: 13, modifier: "+1", isProficient: false, savingThrow: "+1", hasDisadvantage: true },
        ],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.classes()).toContain("dnd-ui-disadvantage");
    expect(indicator.find(".svg-icon").attributes("data-icon")).toBe("chevrons-down");
    expect(setTooltip).toHaveBeenCalledWith(expect.anything(), "Disadvantage on CON saving throws", { delay: 0 });
  });

  it("keeps an empty indicator slot when neither flag is set", () => {
    const wrapper = mount(AbilityCards, {
      props: {
        abilities: [{ label: "CHA", total: 8, modifier: "-1", isProficient: false, savingThrow: "-1" }],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.exists()).toBe(true);
    expect(indicator.find(".svg-icon").exists()).toBe(false);
    expect(setTooltip).not.toHaveBeenCalled();
  });
});
