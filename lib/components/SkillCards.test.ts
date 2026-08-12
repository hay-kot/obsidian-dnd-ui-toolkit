import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setTooltip } from "obsidian";
import SkillCards from "./SkillCards.vue";

describe("SkillCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skill items", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [
          { label: "Athletics", ability: "STR", modifier: 5, isProficient: true },
          { label: "Acrobatics", ability: "DEX", modifier: 2 },
        ],
      },
    });

    expect(wrapper.findAll(".dnd-ui-skill-card")).toHaveLength(2);
    expect(wrapper.text()).toContain("Athletics");
    expect(wrapper.text()).toContain("STR");
    expect(wrapper.text()).toContain("+5");
  });

  it("applies proficient class", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Athletics", ability: "STR", modifier: 5, isProficient: true }],
      },
    });

    const card = wrapper.find(".dnd-ui-skill-card");
    expect(card.classes()).toContain("dnd-ui-proficient");
  });

  it("applies expert class", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Stealth", ability: "DEX", modifier: 10, isExpert: true }],
      },
    });

    const card = wrapper.find(".dnd-ui-skill-card");
    expect(card.classes()).toContain("dnd-ui-expert");
  });

  it("applies half-proficient class", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "History", ability: "INT", modifier: 1, isHalfProficient: true }],
      },
    });

    const card = wrapper.find(".dnd-ui-skill-card");
    expect(card.classes()).toContain("dnd-ui-half-proficient");
  });

  it("formats negative modifiers", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Athletics", ability: "STR", modifier: -1 }],
      },
    });

    expect(wrapper.text()).toContain("-1");
  });

  it("formats zero modifier with plus sign", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Athletics", ability: "STR", modifier: 0 }],
      },
    });

    expect(wrapper.text()).toContain("+0");
  });

  it("marks advantage with an icon and an instant tooltip", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Stealth", ability: "DEX", modifier: 5, hasAdvantage: true }],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.classes()).toContain("dnd-ui-advantage");
    expect(indicator.find(".svg-icon").attributes("data-icon")).toBe("chevrons-up");
    expect(setTooltip).toHaveBeenCalledWith(expect.anything(), "Advantage on Stealth checks", { delay: 0 });
  });

  it("marks disadvantage with an icon and an instant tooltip", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Athletics", ability: "STR", modifier: 1, hasDisadvantage: true }],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.classes()).toContain("dnd-ui-disadvantage");
    expect(indicator.find(".svg-icon").attributes("data-icon")).toBe("chevrons-down");
    expect(setTooltip).toHaveBeenCalledWith(expect.anything(), "Disadvantage on Athletics checks", { delay: 0 });
  });

  it("keeps an empty indicator slot when neither flag is set so values stay aligned", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Arcana", ability: "INT", modifier: 3 }],
      },
    });

    const indicator = wrapper.find(".dnd-ui-adv-indicator");
    expect(indicator.exists()).toBe(true);
    expect(indicator.classes()).not.toContain("dnd-ui-advantage");
    expect(indicator.classes()).not.toContain("dnd-ui-disadvantage");
    expect(indicator.find(".svg-icon").exists()).toBe(false);
    expect(setTooltip).not.toHaveBeenCalled();
  });

  it("no longer tints the skill name or value", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [{ label: "Stealth", ability: "DEX", modifier: 5, hasAdvantage: true }],
      },
    });

    const card = wrapper.find(".dnd-ui-skill-card");
    expect(card.classes()).not.toContain("dnd-ui-advantage");
  });
});
