import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SpellComponents from "./SpellComponents.vue";

describe("SpellComponents", () => {
  it("renders all spell component fields in grid", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: {
          casting_time: "1 action",
          range: "60 feet",
          components: "V, S, M",
          duration: "Concentration, 1 minute",
        },
      },
    });

    expect(wrapper.text()).toContain("1 action");
    expect(wrapper.text()).toContain("60 feet");
    expect(wrapper.text()).toContain("V, S, M");
    expect(wrapper.text()).toContain("Concentration, 1 minute");
    expect(wrapper.findAll(".dnd-ui-spell-grid-item")).toHaveLength(4);
  });

  it("omits fields that are not provided", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: { casting_time: "1 action" },
      },
    });

    expect(wrapper.findAll(".dnd-ui-spell-grid-item")).toHaveLength(1);
  });

  it("renders save DC in accent panel", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: {
          casting_time: "1 action",
          range: "60 feet",
          save: "dexterity",
          save_dc: 15,
        },
      },
    });

    expect(wrapper.find(".dnd-ui-spell-accent").exists()).toBe(true);
    expect(wrapper.text()).toContain("DC 15");
    expect(wrapper.text()).toContain("DEX Save");
  });

  it("renders attack bonus in accent panel", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: {
          casting_time: "1 action",
          range: "120 feet",
          attack: true,
          attack_bonus: 7,
        },
      },
    });

    expect(wrapper.find(".dnd-ui-spell-accent").exists()).toBe(true);
    expect(wrapper.text()).toContain("+7");
    expect(wrapper.text()).toContain("Spell Atk");
  });

  it("renders both save DC and attack bonus", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: {
          casting_time: "1 action",
          save: "wisdom",
          save_dc: 14,
          attack: true,
          attack_bonus: 6,
        },
      },
    });

    expect(wrapper.text()).toContain("DC 14");
    expect(wrapper.text()).toContain("WIS Save");
    expect(wrapper.text()).toContain("+6");
    expect(wrapper.findAll(".dnd-ui-spell-accent-item")).toHaveLength(2);
  });

  it("hides accent panel when neither save nor attack", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: {
          casting_time: "1 action",
          range: "Self",
          duration: "Instantaneous",
        },
      },
    });

    expect(wrapper.find(".dnd-ui-spell-accent").exists()).toBe(false);
  });
});
