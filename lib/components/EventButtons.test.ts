import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EventButtons from "./EventButtons.vue";
import type { EventButtonsBlock } from "lib/types";

describe("EventButtons", () => {
  const config: EventButtonsBlock = {
    items: [
      { name: "Short Rest", value: "short-rest" },
      { name: "Long Rest", value: "long-rest" },
      { name: "Partial", value: { event: "short-rest", amount: 2 } },
    ],
  };

  it("renders all buttons", () => {
    const wrapper = mount(EventButtons, { props: { config } });

    const buttons = wrapper.findAll(".dnd-ui-event-button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].text()).toBe("Short Rest");
    expect(buttons[1].text()).toBe("Long Rest");
  });

  it("emits click with string value", async () => {
    const wrapper = mount(EventButtons, { props: { config } });

    await wrapper.findAll(".dnd-ui-event-button")[0].trigger("click");

    const emitted = wrapper.emitted("click");
    expect(emitted).toHaveLength(1);
    expect(emitted![0][0]).toBe("short-rest");
  });

  it("emits click with object value", async () => {
    const wrapper = mount(EventButtons, { props: { config } });

    await wrapper.findAll(".dnd-ui-event-button")[2].trigger("click");

    const emitted = wrapper.emitted("click");
    expect(emitted).toHaveLength(1);
    expect(emitted![0][0]).toEqual({ event: "short-rest", amount: 2 });
  });

  it("sets correct title attribute", () => {
    const wrapper = mount(EventButtons, { props: { config } });

    const buttons = wrapper.findAll(".dnd-ui-event-button");
    expect(buttons[0].attributes("title")).toBe("Trigger Short Rest event");
  });
});
