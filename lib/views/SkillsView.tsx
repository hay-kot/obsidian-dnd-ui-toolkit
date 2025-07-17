import * as Tmpl from "lib/html-templates";
import { type SkillItem, SkillGrid } from "lib/components/skill-cards";
import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import * as SkillsService from "lib/domains/skills";
import { AbilityBlock, AbilityScores } from "lib/types";
import { useFileContext } from "./filecontext";

export class SkillsView extends BaseView {
  public codeblock = "skills";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): string {
    const abilityBlock = AbilityService.parseAbilityBlockFromDocument(el, ctx);
    const skillsBlock = SkillsService.parseSkillsBlock(source);

    const data: SkillItem[] = [];

    const fc = useFileContext(this.app, ctx);
    const frontmatter = fc.frontmatter();

    for (const skill of SkillsService.Skills) {
      const isHalfProficient =
        skillsBlock.half_proficiencies.find((x) => {
          return x.toLowerCase() === skill.label.toLowerCase();
        }) !== undefined;

      const isProficient =
        skillsBlock.proficiencies.find((x) => {
          return x.toLowerCase() === skill.label.toLowerCase();
        }) !== undefined;

      const isExpert =
        skillsBlock.expertise.find((x) => {
          return x.toLowerCase() === skill.label.toLowerCase();
        }) !== undefined;

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
      if (isExpert) {
        skillCheckValue += frontmatter.proficiency_bonus * 2;
      } else if (isProficient) {
        skillCheckValue += frontmatter.proficiency_bonus;
      } else if (isHalfProficient) {
        skillCheckValue += Math.floor(frontmatter.proficiency_bonus / 2);
      }

      for (const bonus of skillsBlock.bonuses) {
        if (bonus.target.toLowerCase() === skill.label.toLowerCase()) {
          skillCheckValue += bonus.value;
        }
      }

      const abbreviation = skill.ability.substring(0, 3).toUpperCase();

      data.push({
        label: skill.label,
        ability: abbreviation,
        modifier: skillCheckValue,
        isProficient: isProficient,
        isExpert: isExpert,
        isHalfProficient: isHalfProficient,
      });
    }

    return Tmpl.Render(SkillGrid({ items: data }));
  }
}
