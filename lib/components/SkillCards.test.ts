import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SkillCards from "./SkillCards.vue";

describe("SkillCards", () => {
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
});
