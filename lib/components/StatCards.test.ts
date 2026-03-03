import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatCards from "./StatCards.vue";

describe("StatCards", () => {
  it("renders stat items in grid", () => {
    const wrapper = mount(StatCards, {
      props: {
        items: [
          { label: "AC", value: "18" },
          { label: "Speed", value: "30ft" },
        ],
        grid: { columns: 2 },
      },
    });

    expect(wrapper.findAll(".dnd-ui-generic-card")).toHaveLength(2);
    expect(wrapper.text()).toContain("AC");
  });

  it("renders sublabels when present", () => {
    const wrapper = mount(StatCards, {
      props: {
        items: [{ label: "HP", value: "45", sublabel: "max" }],
      },
    });

    expect(wrapper.find(".dnd-ui-generic-card-sublabel").text()).toBe("max");
  });

  it("defaults to 3 columns", () => {
    const wrapper = mount(StatCards, {
      props: { items: [] },
    });

    expect(wrapper.find(".dnd-ui-card-grid").attributes("style")).toContain("repeat(3, 1fr)");
  });
});
