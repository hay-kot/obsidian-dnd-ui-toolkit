import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PurposeGoalsCard from "./PurposeGoalsCard.vue";

describe("PurposeGoalsCard", () => {
  it("renders purpose, obstacle and goals", () => {
    const wrapper = mount(PurposeGoalsCard, {
      props: {
        static: {
          state_key: "goals-test",
          purpose: "Protect the village",
          obstacle: "Limited time",
          goals: ["Find scout", "Secure gate"],
        },
        state: {
          goals: [1, 0],
        },
      },
    });

    expect(wrapper.text()).toContain("Purpose");
    expect(wrapper.text()).toContain("Protect the village");
    expect(wrapper.text()).toContain("Obstacle");
    expect(wrapper.text()).toContain("Limited time");
    expect(wrapper.text()).toContain("Goals");
    expect(wrapper.text()).toContain("Find scout");
    expect(wrapper.findAll(".dnd-ui-purpose-goals-dot-filled")).toHaveLength(1);
  });

  it("emits updated state when increasing and decreasing", async () => {
    const wrapper = mount(PurposeGoalsCard, {
      props: {
        static: {
          state_key: "goals-test",
          goals: ["Find scout"],
        },
        state: {
          goals: [1],
        },
      },
    });

    const buttons = wrapper.findAll("button.dnd-ui-purpose-goals-btn");
    await buttons[0].trigger("click");
    await buttons[1].trigger("click");

    const emits = wrapper.emitted("update:state");
    expect(emits).toHaveLength(2);
    expect((emits![0][0] as { goals: number[] }).goals[0]).toBe(2);
    expect((emits![1][0] as { goals: number[] }).goals[0]).toBe(0);
  });
});
