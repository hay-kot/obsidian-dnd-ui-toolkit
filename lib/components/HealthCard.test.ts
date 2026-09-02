import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setTooltip } from "obsidian";
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
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe("progress bar", () => {
    const bar = ".dnd-ui-health-progress-bar";
    const temp = ".dnd-ui-health-progress-temp";
    const bonusTrack = ".dnd-ui-health-progress-bonus-track";

    it("fills the whole bar at full health with no bonuses", () => {
      const wrapper = mount(HealthCard, { props: makeProps() });

      expect(wrapper.find(bar).attributes("style")).toContain("width: 100%");
      expect(wrapper.find(temp).exists()).toBe(false);
      expect(wrapper.find(bonusTrack).exists()).toBe(false);
    });

    it("scales health down to make room for the temp HP pool", () => {
      // 20 max + 5 temp = 25 wide, so health is 20/25 and temp is the last 5/25
      const wrapper = mount(HealthCard, { props: makeProps({ state: { temporary: 5 } }) });

      expect(wrapper.find(bar).attributes("style")).toContain("width: 80%");
      expect(wrapper.find(temp).attributes("style")).toContain("width: 20%");
    });

    it("places the temp HP pool after the temp max headroom", () => {
      // 20 base + 5 temp max + 5 temp HP = 30 wide, so temp HP starts at 25/30
      const wrapper = mount(HealthCard, {
        props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { temporary: 5 } }),
      });

      const style = wrapper.find(temp).attributes("style");
      expect(style).toContain("left: 83.3333%");
      expect(style).toContain("width: 16.6667%");
    });

    it("leaves a gap when health is below the base maximum", () => {
      const wrapper = mount(HealthCard, {
        props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 10 } }),
      });

      // Health stops at 10/25 but the headroom still sits at its own offset
      expect(wrapper.find(bar).attributes("style")).toContain("width: 40%");
      expect(wrapper.find(bonusTrack).attributes("style")).toContain("left: 80%");
    });

    it("does not divide by zero at 0 max health", () => {
      const wrapper = mount(HealthCard, { props: makeProps({ static: { health: 0 }, state: { current: 0 } }) });

      expect(wrapper.find(bar).attributes("style")).toContain("width: 0%");
    });
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
    expect(wrapper.text()).toContain("Hit dice (d8)");
  });

  it("includes temp max health in the maximum", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } } }),
    });

    expect(wrapper.text()).toContain("/ 25");
    expect(wrapper.text()).toContain("incl. +5 max");
  });

  it("does not show the temp max health label when it is 0", () => {
    const wrapper = mount(HealthCard, { props: makeProps() });

    expect(wrapper.text()).not.toContain("max");
    expect(wrapper.find(".dnd-ui-health-progress-bonus-track").exists()).toBe(false);
  });

  it("heals into temp max health", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 20 } }),
    });

    await wrapper.find(".dnd-ui-health-heal").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect((emitted![0][0] as HealthState).current).toBe(21);
  });

  it("does not heal past base plus temp max health", async () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 25 } }),
    });

    await wrapper.find(".dnd-ui-health-heal").trigger("click");

    const emitted = wrapper.emitted("update:state");
    expect((emitted![0][0] as HealthState).current).toBe(25);
  });

  it("splits the progress bar between base health and temp max health", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 22 } }),
    });

    // 20 base + 5 bonus = 25 total; 20 filled base, 2 filled bonus
    expect(wrapper.find(".dnd-ui-health-progress-bar").attributes("style")).toContain("width: 80%");
    expect(wrapper.find(".dnd-ui-health-progress-bar-bonus").attributes("style")).toContain("width: 8%");

    const track = wrapper.find(".dnd-ui-health-progress-bonus-track").attributes("style");
    expect(track).toContain("left: 80%");
    expect(track).toContain("width: 20%");
  });

  it("registers the note as a tooltip on the temp max label and bar", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5, note: "Aid" } }, state: { current: 22 } }),
      attachTo: document.body,
    });

    // The label plus both purple bar sections, so the note is reachable from either
    const tipped = (sel: string) => wrapper.find(sel).element;
    expect(setTooltip).toHaveBeenCalledWith(tipped(".dnd-ui-health-max-bonus"), "Aid");
    expect(setTooltip).toHaveBeenCalledWith(tipped(".dnd-ui-health-progress-bonus-track"), "Aid");
    expect(setTooltip).toHaveBeenCalledWith(tipped(".dnd-ui-health-progress-bar-bonus"), "Aid");

    expect(wrapper.find(".dnd-ui-health-max-bonus").classes()).toContain("dnd-ui-health-has-note");
  });

  it("registers no tooltip for the bare amount form", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 22 } }),
      attachTo: document.body,
    });

    expect(setTooltip).not.toHaveBeenCalled();
    expect(wrapper.find(".dnd-ui-health-max-bonus").classes()).not.toContain("dnd-ui-health-has-note");
  });

  it("keeps the bonus fill empty while current health is within base health", () => {
    const wrapper = mount(HealthCard, {
      props: makeProps({ static: { temp_max_health: { hp: 5 } }, state: { current: 20 } }),
    });

    // Stays mounted at zero width rather than unmounting, so healing into it animates
    expect(wrapper.find(".dnd-ui-health-progress-bar-bonus").attributes("style")).toContain("width: 0%");
    expect(wrapper.find(".dnd-ui-health-progress-bonus-track").exists()).toBe(true);
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
