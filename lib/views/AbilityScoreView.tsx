import * as Tmpl from "lib/html-templates";
import { AbilityView } from "lib/components/ability-cards";
import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import { Ability } from "lib/types";
import { useFileContext } from "./filecontext";
import { msgbus } from "lib/services/event-bus";

export class AbilityScoreView extends BaseView {
  public codeblock = "ability";

  public render(source: string, __: HTMLElement, ctx: MarkdownPostProcessorContext): string {
    const abilityBlock = AbilityService.parseAbilityBlock(source);

    const data: Ability[] = [];

    const fc = useFileContext(this.app, ctx);
    const frontmatter = fc.frontmatter();

    for (const [key, value] of Object.entries(abilityBlock.abilities)) {
      const isProficient = abilityBlock.proficiencies.includes(key);

      const label = key.charAt(0).toUpperCase() + key.slice(1);

      // Calculate total ability score including score modifiers
      const totalScore = AbilityService.getTotalScore(
        value,
        key as keyof typeof abilityBlock.abilities,
        abilityBlock.bonuses
      );

      // Calculate saving throw with base modifier + proficiency + saving throw bonuses
      let savingThrowValue = AbilityService.calculateModifier(totalScore);
      if (isProficient) {
        savingThrowValue += frontmatter.proficiency_bonus;
      }
      savingThrowValue += AbilityService.getSavingThrowBonus(
        key as keyof typeof abilityBlock.abilities,
        abilityBlock.bonuses
      );

      const abbreviation = label.substring(0, 3).toUpperCase();

      data.push({
        label: abbreviation,
        total: totalScore,
        modifier: AbilityService.calculateModifier(totalScore),
        isProficient: isProficient,
        savingThrow: savingThrowValue,
      });
    }

    msgbus.publish(ctx.sourcePath, "abilities:changed", undefined);
    return Tmpl.Render(AbilityView(data));
  }
}
