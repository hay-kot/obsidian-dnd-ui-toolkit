import * as Utils from "lib/utils/utils";
import { SkillsBlock } from "lib/types";
import { parse } from "yaml";

export { Skills } from "./dnd/skills";

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
