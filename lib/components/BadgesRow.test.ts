import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BadgesRow from "./BadgesRow.vue";

describe("BadgesRow", () => {
  it("renders badge items", () => {
    const wrapper = mount(BadgesRow, {
      props: {
        data: {
          items: [
            { label: "AC", value: "18", sublabel: "", reverse: false },
            { label: "Speed", value: "30ft", sublabel: "", reverse: false },
          ],
          dense: false,
          grid: {},
        },
      },
    });

    expect(wrapper.findAll(".dnd-ui-badge-item")).toHaveLength(2);
    expect(wrapper.text()).toContain("AC");
    expect(wrapper.text()).toContain("18");
  });

  it("renders reversed badges", () => {
    const wrapper = mount(BadgesRow, {
      props: {
        data: {
          items: [{ label: "AC", value: "18", sublabel: "", reverse: true }],
          dense: false,
          grid: {},
        },
      },
    });

    const item = wrapper.find(".dnd-ui-badge-item");
    const spans = item.findAll("span");
    expect(spans[0].classes()).toContain("dnd-ui-badge-value");
    expect(spans[1].classes()).toContain("dnd-ui-badge-label");
  });

  it("applies dense class", () => {
    const wrapper = mount(BadgesRow, {
      props: {
        data: { items: [], dense: true, grid: {} },
      },
    });

    expect(wrapper.find(".dnd-ui-badges-row").classes()).toContain("dnd-ui-dense");
  });
});
