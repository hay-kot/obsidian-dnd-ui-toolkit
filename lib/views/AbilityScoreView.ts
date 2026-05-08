import { BaseView } from "./BaseView";
import { TemplateAwareComponent } from "./TemplateAwareComponent";
import AbilityCards from "../components/AbilityCards.vue";
import { MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import { msgbus } from "lib/services/event-bus";

export class AbilityScoreView extends BaseView {
  public codeblock = "ability";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const cmp = new AbilityScoreComponent(el, source, this.app, ctx);
    ctx.addChild(cmp);
  }
}

class AbilityScoreComponent extends TemplateAwareComponent {
  protected listenToAbilitiesChange = false;

  protected processAndRender() {
    const raw = AbilityService.parseAbilityBlock(this.source);
    this.setupTemplates([this.source]);
    const frontmatter = this.fileContext.frontmatter();
    const abilityBlock = AbilityService.resolveAbilityBlock(raw, frontmatter);

    const abilities = (Object.entries(abilityBlock.abilities) as [string, number][]).map(([key, value]) => {
      const isProficient = abilityBlock.proficiencies.includes(key);
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const totalScore = AbilityService.getTotalScore(
        value,
        key as keyof typeof abilityBlock.abilities,
        abilityBlock.bonuses
      );

      let savingThrowValue = AbilityService.calculateModifier(totalScore);
      if (isProficient) savingThrowValue += frontmatter.proficiency_bonus;
      savingThrowValue += AbilityService.getSavingThrowBonus(
        key as keyof typeof abilityBlock.abilities,
        abilityBlock.bonuses
      );

      const abbreviation = label.substring(0, 3).toUpperCase();

      return {
        label: abbreviation,
        total: totalScore,
        modifier: AbilityService.formatModifier(AbilityService.calculateModifier(totalScore)),
        isProficient,
        savingThrow: AbilityService.formatModifier(savingThrowValue),
      };
    });

    msgbus.publish(this.fileContext.filepath, "abilities:changed", undefined);

    this.mount(AbilityCards, { abilities });
  }
}
