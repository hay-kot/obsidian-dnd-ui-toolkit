import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HealthCard from "./HealthCard.vue";
import type { ParsedHealthBlock } from "lib/types";
import type { HealthState } from "lib/domains/healthpoints";

function makeProps(overrides?: { static?: Partial<ParsedHealthBlock>; state?: Partial<HealthState> }) {
  const staticBlock: ParsedHealthBlock = {
    label: "Hit Points",
    state_key: "hp-test",
    health: 20,
    hitdice: undefined,
    death_saves: true,
    reset_on: [{ event: "long-rest" }],
    ...overrides?.static,
  };
  const state: HealthState = {
    current: 20,
    temporary: 0,
    hitdiceUsed: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    ...overrides?.state,
  };
  return { static: staticBlock, state };
}

describe("HealthCard", () => {
  it("renders current and max health", () => {
    const wrapper = mount(HealthCard, { props: makeProps() });

    expect(wrapper.text()).toContain("20");
    expect(wrapper.text()).toContain("/ 20");
  });

  it("shows temporary HP when > 0", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { temporary: 5 } }),
    });

    expect(wrapper.text()).toContain("+5 temp");
  });

  it("does not show temporary HP when 0", () => {
    const wrapper = mount(HealthCard, { props: makeProps() });

    expect(wrapper.text()).not.toContain("temp");
  });

  it("emits update:state on heal", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 15 } }),
    });

    // The input defaults to "1"
    await wrapper.find(".dnd-ui-health-heal").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as HealthState).current).toBe(16);
  });

  it("emits update:state on damage", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 10 } }),
    });

    await wrapper.find(".dnd-ui-health-damage").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as HealthState).current).toBe(9);
  });

  it("does not exceed max health on heal", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 20 } }),
    });

    await wrapper.find(".dnd-ui-health-heal").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as HealthState).current).toBe(20);
  });

  it("does not go below 0 on damage", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 0 } }),
    });

    await wrapper.find(".dnd-ui-health-damage").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    expect((emitted![0][0] as HealthState).current).toBe(0);
  });

  it("shows death saves when current <= 0 and death_saves enabled", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 0 } }),
    });

    expect(wrapper.find(".dnd-ui-death-saves-container").exists()).toBe(true);
  });

  it("hides death saves when current > 0", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 1 } }),
    });

    expect(wrapper.find(".dnd-ui-death-saves-container").exists()).toBe(false);
  });

  it("shows death saves at any HP when death_saves is 'always'", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { death_saves: "always" }, state: { current: 20 } }),
    });

    expect(wrapper.find(".dnd-ui-death-saves-container").exists()).toBe(true);
  });

  it("renders hit dice when provided", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({
        static: { hitdice: [{ dice: "d8", value: 3 }] },
      }),
    });

    expect(wrapper.find(".dnd-ui-hit-dice-container").exists()).toBe(true);
    expect(wrapper.text()).toContain("HIT DICE (d8)");
  });

  it("applies damage to temp HP first", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ state: { current: 10, temporary: 3 } }),
    });

    await wrapper.find(".dnd-ui-health-damage").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect(emitted).toHaveLength(1);
    const newState = emitted![0][0] as HealthState;
    expect(newState.temporary).toBe(2);
    expect(newState.current).toBe(10);
  });
});
