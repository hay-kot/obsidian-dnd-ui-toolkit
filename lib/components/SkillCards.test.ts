import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SkillCards from "./SkillCards.vue";

function filledDotCount(card: ReturnType<typeof findCard>): number {
  return card.findAll(".dnd-ui-skill-dot-filled").length;
}

function findCard(wrapper: ReturnType<typeof mount>, index: number) {
  return wrapper.findAll(".dnd-ui-skill-card")[index];
}

describe("SkillCards", () => {
  it("groups skills into physical, cognitive, and spiritual columns", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [
          { label: "Agility", ability: "SPD", modifier: 0, rank: 1 },
          { label: "Crafting", ability: "INT", modifier: 0, rank: 2 },
          { label: "Deception", ability: "PRE", modifier: 0, rank: 3 },
        ],
      },
    });

    expect(wrapper.findAll(".dnd-ui-skill-realm")).toHaveLength(3);
    const realmText = wrapper.findAll(".dnd-ui-skill-realm").map((r) => r.text());
    expect(realmText[0]).toContain("Agility");
    expect(realmText[1]).toContain("Crafting");
    expect(realmText[2]).toContain("Deception");
    expect(wrapper.text()).not.toContain("Physical");
    expect(wrapper.text()).not.toContain("Cognitive");
    expect(wrapper.text()).not.toContain("Spiritual");
  });

  it("supports custom realms from YAML config without hardcoded labels", () => {
    const wrapper = mount(SkillCards, {
      props: {
        realms: [
          { id: "might", skills: ["slam"] },
          { id: "mind", skills: ["logic"] },
          { id: "soul", skills: ["aura"] },
        ],
        items: [
          { label: "Slam", ability: "STR", modifier: 0, rank: 1 },
          { label: "Logic", ability: "INT", modifier: 0, rank: 2 },
          { label: "Aura", ability: "PRE", modifier: 0, rank: 3 },
        ],
      },
    });

    const realms = wrapper.findAll(".dnd-ui-skill-realm");
    expect(realms).toHaveLength(3);
    expect(realms[0].text()).toContain("Slam");
    expect(realms[1].text()).toContain("Logic");
    expect(realms[2].text()).toContain("Aura");
  });

  it("renders each row with modifier, label, ability, and five dots", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [
          { label: "Athletics", ability: "STR", modifier: 5, rank: 0 },
          { label: "Acrobatics", ability: "DEX", modifier: 2, rank: 0 },
        ],
      },
    });

    expect(wrapper.findAll(".dnd-ui-skill-card")).toHaveLength(2);
    const text = wrapper.text();
    expect(text).toContain("Athletics");
    expect(text).toContain("STR");
    expect(text).toMatch(/5/);
    expect(text).toContain("Acrobatics");
    for (const card of wrapper.findAll(".dnd-ui-skill-card")) {
      expect(card.findAll(".dnd-ui-skill-dot")).toHaveLength(5);
    }
  });

  it("renders modifier as plain number without a plus sign", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [
          { label: "A", ability: "STR", modifier: 0, rank: 0 },
          { label: "B", ability: "DEX", modifier: 3, rank: 0 },
        ],
      },
    });
    const text = wrapper.text();
    expect(text).toContain("0");
    expect(text).toContain("3");
    expect(text).not.toMatch(/\+0/);
    expect(text).not.toMatch(/\+3/);
  });

  it("fills circles left to right for explicit rank 1..5 and none when rank 0", () => {
    const items = [0, 1, 2, 3, 4, 5].map((r) => ({
      label: `L${r}`,
      ability: "X",
      modifier: 0,
      rank: r,
    }));
    const wrapper = mount(SkillCards, { props: { items } });
    for (let i = 0; i <= 5; i++) {
      const card = findCard(wrapper, i);
      expect(card).toBeDefined();
      expect(filledDotCount(card!)).toBe(i);
    }
  });

  it("derives rank from legacy proficiency when rank is omitted (SkillsView path)", () => {
    const wrapper = mount(SkillCards, {
      props: {
        items: [
          { label: "H", ability: "INT", modifier: 1, isHalfProficient: true },
          { label: "P", ability: "DEX", modifier: 2, isProficient: true },
          { label: "E", ability: "DEX", modifier: 3, isExpert: true },
          { label: "N", ability: "WIS", modifier: 0 },
        ],
      },
    });
    expect(filledDotCount(findCard(wrapper, 0)!)).toBe(2);
    expect(filledDotCount(findCard(wrapper, 1)!)).toBe(3);
    expect(filledDotCount(findCard(wrapper, 2)!)).toBe(5);
    expect(filledDotCount(findCard(wrapper, 3)!)).toBe(0);
  });
});
