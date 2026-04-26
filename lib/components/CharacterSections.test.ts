import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import CharacterSections from "./CharacterSections.vue";

describe("CharacterSections", () => {
  it("renders all four sections with list values", () => {
    const wrapper = mount(CharacterSections, {
      props: {
        data: {
          conditions_injuries: {
            label: "Conditions & Injuries",
            items: ["Fatigued", "Sprained ankle"],
          },
          expertises: {
            label: "Expertises",
            items: ["Athletics", "Medicine"],
          },
          weapons: {
            label: "Weapons",
            items: [
              { name: "Longsword", dice: "1d8", damage: "Slashing" },
              { name: "Shortbow", dice: "1d6", damage: "Piercing" },
            ],
          },
          talents: {
            label: "Talents",
            items: ["Brutal strike", "Iron will"],
          },
        },
      },
    });

    expect(wrapper.text()).toContain("Conditions & Injuries");
    expect(wrapper.text()).toContain("Fatigued");
    expect(wrapper.text()).toContain("Weapons");
    expect(wrapper.text()).toContain("Longsword");
    expect(wrapper.text()).toContain("1d8");
    expect(wrapper.text()).toContain("Slashing");
    expect(wrapper.text()).toContain("Expertises");
    expect(wrapper.text()).toContain("Athletics");
    expect(wrapper.text()).toContain("Talents");
    expect(wrapper.text()).toContain("Iron will");
    expect(wrapper.findAll(".dnd-ui-character-sections-card")).toHaveLength(4);
  });

  it("shows fallback labels and placeholder when sections are empty", () => {
    const wrapper = mount(CharacterSections, {
      props: {
        data: {},
      },
    });

    expect(wrapper.text()).toContain("Conditions & Injuries");
    expect(wrapper.text()).toContain("Weapons");
    expect(wrapper.text()).toContain("Expertises");
    expect(wrapper.text()).toContain("Talents");
    expect(wrapper.findAll(".dnd-ui-character-sections-empty")).toHaveLength(4);
  });
});
