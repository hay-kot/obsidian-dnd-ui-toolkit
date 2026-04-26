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
  it("renders additional resources with current/max", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({
        static: {
          resources: [
            { key: "focus", label: "Focus", max: 10, current: 8 },
            { key: "investiture", label: "Investiture", max: 12, current: 4 },
          ],
        },
        state: {
          resources: { focus: 6, investiture: 3 },
        },
      }),
    });

    expect(wrapper.text()).toContain("Focus");
    expect(wrapper.text()).toContain("6");
    expect(wrapper.text()).toContain("/ 10");
    expect(wrapper.text()).toContain("Investiture");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("/ 12");
  });

  it("restores and loses a resource without temp buttons", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({
        static: {
          resources: [{ key: "focus", label: "Focus", max: 10, current: 8 }],
        },
        state: {
          resources: { focus: 5 },
        },
      }),
    });

    const restoreButton = wrapper
      .findAll("button.dnd-ui-health-heal")
      .find((b) => b.text().trim() === "Restore");
    const loseButton = wrapper
      .findAll("button.dnd-ui-health-damage")
      .find((b) => b.text().trim() === "Lose");

    expect(restoreButton).toBeDefined();
    expect(loseButton).toBeDefined();

    await restoreButton!.trigger("click");
    const restore = wrapper.emitted("update:state");
    expect(restore).toHaveLength(1);
    expect((restore![0][0] as HealthState).resources?.focus).toBe(6);

    await loseButton!.trigger("click");
    const all = wrapper.emitted("update:state");
    expect(all).toHaveLength(2);
    expect((all![1][0] as HealthState).resources?.focus).toBe(4);

    expect(wrapper.findAll(".dnd-ui-health-temp")).toHaveLength(1);
  });

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
