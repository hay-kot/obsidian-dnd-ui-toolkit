import * as Tmpl from "lib/html-templates";
import * as Components from "lib/components";
import { BaseView } from "./BaseView";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";

export class AbilityScoreView extends BaseView {
  public codeblock = "ability";

  public render(source: string, __: HTMLElement, ctx: MarkdownPostProcessorContext): string {
    const abilityBlock = AbilityService.parseAbilityBlock(source);

    const data: Components.Ability[] = [];

    const frontmatter = this.frontmatter(ctx);

    for (const [key, value] of Object.entries(abilityBlock.abilities)) {
      const isProficient = abilityBlock.proficiencies.includes(key);

      const label = key.charAt(0).toUpperCase() + key.slice(1);

      let savingThrowValue = AbilityService.calculateModifier(value);
      if (isProficient) {
        savingThrowValue += frontmatter.proficiencyBonus;
      }

      for (const bonus of abilityBlock.bonuses) {
        if (bonus.target.toLowerCase() === key) {
          savingThrowValue += bonus.value;
        }
      }

      const abbreviation = label.substring(0, 3).toUpperCase();

      data.push({
        label: abbreviation,
        total: value,
        modifier: AbilityService.calculateModifier(value),
        isProficient: isProficient,
        savingThrow: savingThrowValue,
      });
    }

    return Tmpl.Render(Components.AbilityView(data));
  }
}
