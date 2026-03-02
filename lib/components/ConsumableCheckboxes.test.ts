import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ConsumableCheckboxes from "./ConsumableCheckboxes.vue";
import type { ParsedConsumableBlock } from "lib/types";
import type { ConsumableState } from "lib/domains/consumables";

function makeProps(overrides?: { static?: Partial<ParsedConsumableBlock>; state?: Partial<ConsumableState> }) {
  const staticBlock: ParsedConsumableBlock = {
    label: "Spell Slots",
    state_key: "spell-1",
    uses: 3,
    ...overrides?.static,
  };
  const state: ConsumableState = {
    value: 0,
    ...overrides?.state,
  };
  return { static: staticBlock, state };
}

describe("ConsumableCheckboxes", () => {
  it("renders the correct number of checkboxes", () => {
    const wrapper = mount(ConsumableCheckboxes, { props: makeProps() });

    expect(wrapper.findAll(".dnd-ui-checkbox-button")).toHaveLength(3);
  });

  it("renders label when provided", () => {
    const wrapper = mount(ConsumableCheckboxes, { props: makeProps() });

    expect(wrapper.find(".dnd-ui-consumable-label").text()).toBe("Spell Slots");
  });

  it("does not render label when not provided", () => {
    const wrapper = mount(ConsumableCheckboxes, {
      props: makeProps({ static: { label: "" } }),
    });

    expect(wrapper.find(".dnd-ui-consumable-label").exists()).toBe(false);
  });

  it("emits update:state with incremented value on unchecked click", async () => {
    const wrapper = mount(ConsumableCheckboxes, {
      props: makeProps({ state: { value: 0 } }),
    });

    const buttons = wrapper.findAll(".dnd-ui-checkbox-button");
    await buttons[0].trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as ConsumableState).value).toBe(1);
  });

  it("emits update:state with decremented value on checked click", async () => {
    const wrapper = mount(ConsumableCheckboxes, {
      props: makeProps({ state: { value: 2 } }),
    });

    // Click the first checked checkbox (index 0, which is < value 2)
    const buttons = wrapper.findAll(".dnd-ui-checkbox-button");
    await buttons[0].trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as ConsumableState).value).toBe(0);
  });

  it("marks correct checkboxes as checked based on state value", () => {
    const wrapper = mount(ConsumableCheckboxes, {
      props: makeProps({ state: { value: 2 } }),
    });

    const buttons = wrapper.findAll(".dnd-ui-checkbox-button");
    expect(buttons[0].attributes("aria-pressed")).toBe("true");
    expect(buttons[1].attributes("aria-pressed")).toBe("true");
    expect(buttons[2].attributes("aria-pressed")).toBe("false");
  });
});
