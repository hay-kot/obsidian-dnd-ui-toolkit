import * as Utils from "lib/utils/utils";
import { SkillsBlock } from "lib/types";
import { parseYamlObject } from "lib/utils/yaml";

export { Skills } from "./dnd/skills";

export function parseSkillsBlock(yamlString: string): SkillsBlock {
  const def: SkillsBlock = {
    proficiencies: [],
    expertise: [],
    half_proficiencies: [],
    bonuses: [],
    advantage: {},
    disadvantage: {},
  };

  const parsed = parseYamlObject<SkillsBlock>(yamlString);
  return Utils.mergeWithDefaults(parsed, def);
}
