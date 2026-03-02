import { BaseView } from "./BaseView";
import { VueMarkdown } from "./VueMarkdown";
import SkillCards from "../components/SkillCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import * as SkillsService from "lib/domains/skills";
import { AbilityBlock, AbilityScores, SkillItem } from "lib/types";
import { useFileContext } from "./filecontext";

export class SkillsView extends BaseView {
  public codeblock = "skills";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    let abilityBlock: AbilityBlock;

    try {
      abilityBlock = AbilityService.parseAbilityBlockFromDocument(el, ctx);
    } catch {
      console.debug("No ability block found for skills view, using default values");
      abilityBlock = {
        abilities: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        bonuses: [],
        proficiencies: [],
      };
    }

    const skillsBlock = SkillsService.parseSkillsBlock(source);
    const fc = useFileContext(this.app, ctx);
    const frontmatter = fc.frontmatter();
    const items: SkillItem[] = [];

    for (const skill of SkillsService.Skills) {
      const isHalfProficient = skillsBlock.half_proficiencies.some(
        (x) => x.toLowerCase() === skill.label.toLowerCase()
      );
      const isProficient = skillsBlock.proficiencies.some((x) => x.toLowerCase() === skill.label.toLowerCase());
      const isExpert = skillsBlock.expertise.some((x) => x.toLowerCase() === skill.label.toLowerCase());

      const skillAbility = abilityBlock.abilities[skill.ability as keyof AbilityBlock["abilities"]];
      if (!skillAbility) {
        throw new Error(`Skill ${skill.ability} not found in Skills list`);
      }

      const totalAbilityScore = AbilityService.getTotalScore(
        skillAbility,
        skill.ability as keyof AbilityScores,
        abilityBlock.bonuses
      );
      let skillCheckValue = AbilityService.calculateModifier(totalAbilityScore);
      if (isExpert) skillCheckValue += frontmatter.proficiency_bonus * 2;
      else if (isProficient) skillCheckValue += frontmatter.proficiency_bonus;
      else if (isHalfProficient) skillCheckValue += Math.floor(frontmatter.proficiency_bonus / 2);

      for (const bonus of skillsBlock.bonuses) {
        if (String(bonus.target).toLowerCase() === skill.label.toLowerCase()) {
          skillCheckValue += bonus.value;
        }
      }

      const abbreviation = skill.ability.substring(0, 3).toUpperCase();

      items.push({
        label: skill.label,
        ability: abbreviation,
        modifier: skillCheckValue,
        isProficient,
        isExpert,
        isHalfProficient,
      });
    }

    const child = new VueMarkdown(el);
    child.mount(SkillCards, { items });
    ctx.addChild(child);
  }
}
