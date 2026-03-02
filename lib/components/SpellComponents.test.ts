import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SpellComponents from "./SpellComponents.vue";

describe("SpellComponents", () => {
  it("renders all spell component fields", () => {
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
  });

  it("omits fields that are not provided", () => {
    const wrapper = mount(SpellComponents, {
      props: {
        data: { casting_time: "1 action" },
      },
    });

    expect(wrapper.findAll(".dnd-ui-spell-component-item")).toHaveLength(1);
  });
});
