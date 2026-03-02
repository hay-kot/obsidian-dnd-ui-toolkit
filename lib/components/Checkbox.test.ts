import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Checkbox from "./Checkbox.vue";

describe("Checkbox", () => {
  it("renders a button with correct id and aria-pressed", () => {
    const wrapper = mount(Checkbox, {
      props: { id: "cb-1", checked: true },
    });

    const button = wrapper.find("button");
    expect(button.attributes("id")).toBe("cb-1");
    expect(button.attributes("aria-pressed")).toBe("true");
  });

  it("renders unchecked state", () => {
    const wrapper = mount(Checkbox, {
      props: { id: "cb-2", checked: false },
    });

    expect(wrapper.find("button").attributes("aria-pressed")).toBe("false");
  });

  it("emits toggle on click", async () => {
    const wrapper = mount(Checkbox, {
      props: { id: "cb-3", checked: false },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
  });

  it("applies className prop", () => {
    const wrapper = mount(Checkbox, {
      props: { id: "cb-4", checked: false, className: "dnd-ui-death-save-failure" },
    });

    expect(wrapper.find("button").classes()).toContain("dnd-ui-death-save-failure");
    expect(wrapper.find("button").classes()).toContain("dnd-ui-checkbox-button");
    expect(wrapper.find("button").classes()).toContain("clickable-icon");
  });
});
