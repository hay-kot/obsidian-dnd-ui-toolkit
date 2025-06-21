import * as Utils from "lib/utils/utils";
import { SkillsBlock } from "lib/types";
import { parse } from "yaml";

export const Skills = [
  { label: "Acrobatics", ability: "dexterity" },
  { label: "Animal Handling", ability: "wisdom" },
  { label: "Arcana", ability: "intelligence" },
  { label: "Athletics", ability: "strength" },
  { label: "Deception", ability: "charisma" },
  { label: "History", ability: "intelligence" },
  { label: "Insight", ability: "wisdom" },
  { label: "Intimidation", ability: "charisma" },
  { label: "Investigation", ability: "intelligence" },
  { label: "Medicine", ability: "wisdom" },
  { label: "Nature", ability: "intelligence" },
  { label: "Perception", ability: "wisdom" },
  { label: "Performance", ability: "charisma" },
  { label: "Persuasion", ability: "charisma" },
  { label: "Religion", ability: "intelligence" },
  { label: "Sleight of Hand", ability: "dexterity" },
  { label: "Stealth", ability: "dexterity" },
  { label: "Survival", ability: "wisdom" },
];

export function parseSkillsBlock(yamlString: string): SkillsBlock {
  const def: SkillsBlock = {
    proficiencies: [],
    expertise: [],
    half_proficiencies: [],
    bonuses: [],
  };

  const parsed = parse(yamlString);
  return Utils.mergeWithDefaults(parsed, def);
}
