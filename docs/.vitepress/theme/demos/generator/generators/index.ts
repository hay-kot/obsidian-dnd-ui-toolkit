import type { CharacterData, ClassDefinition } from "../types";
import { generateFrontmatter } from "./frontmatter";
import { generateBadges } from "./badges";
import { generateEventButtons } from "./eventButtons";
import { generateAbilities } from "./abilities";
import { generateSkills } from "./skills";
import { generateHealthpoints } from "./healthpoints";
import { generateSpellSlots, generateClassConsumables } from "./consumables";

export function generateCharacterSheet(data: CharacterData, classDef: ClassDefinition): string {
  const sections = [
    generateFrontmatter(data),
    "",
    generateBadges(data, classDef),
    "",
    generateEventButtons(),
    "",
    "## Abilities",
    "",
    generateAbilities(data, classDef),
    "",
    "## Skills",
    "",
    generateSkills(data),
    "",
    "## Health",
    "",
    generateHealthpoints(data, classDef),
  ];

  const spellSlots = generateSpellSlots(data, classDef);
  if (spellSlots) {
    sections.push("", "## Spell Slots", "", spellSlots);
  }

  const consumables = generateClassConsumables(data, classDef);
  if (consumables) {
    sections.push("", "## Class Features", "", consumables);
  }

  return sections.join("\n") + "\n";
}
