import * as Tmpl from "lib/html-templates";
import { type SkillItem, SkillGrid } from "lib/components/skill-cards";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import * as SkillsService from "lib/domains/skills";
import { AbilityBlock, AbilityScores } from "lib/types";
import { useFileContext, FileContext } from "./filecontext";
import { ReactMarkdown } from "./ReactMarkdown";

export class SkillsView extends BaseView {
  public codeblock = "skills";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const skillsMarkdown = new SkillsMarkdown(el, source, ctx, this.app);
    ctx.addChild(skillsMarkdown);
  }
}

class SkillsMarkdown extends ReactMarkdown {
  private source: string;
  private fileContext: FileContext;

  constructor(
    el: HTMLElement,
    source: string,
    ctx: MarkdownPostProcessorContext,
    app: App
  ) {
    super(el);
    this.source = source;
    this.fileContext = useFileContext(app, ctx);
  }

  async onload() {
    // Set up listeners for abilities and frontmatter changes
    this.setupListeners();
    
    // Process and render initial state
    this.processAndRender();
  }

  private processAndRender() {
    let abilityBlock: AbilityBlock;

    try {
      abilityBlock = AbilityService.parseAbilityBlockFromDocument(this.containerEl, this.fileContext.md());
    } catch {
      console.debug("No ability block found for skills view, using default values");
      // Use default ability scores if no ability block is found
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
    const skillsBlock = SkillsService.parseSkillsBlock(this.source);

    const data: SkillItem[] = [];
    const frontmatter = this.fileContext.frontmatter();

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

    this.renderComponent(data);
  }

  private renderComponent(data: SkillItem[]) {
    // For now, render using the existing HTML template approach
    // Could be refactored to use React components in the future
    this.containerEl.innerHTML = Tmpl.Render(SkillGrid({ items: data }));
  }

  private setupListeners() {
    // Re-render when abilities change (from templated abilities)
    this.addUnloadFn(
      this.fileContext.onAbilitiesChange(() => {
        console.debug("Abilities changed, re-processing skills");
        this.processAndRender();
      })
    );

    // Re-render when frontmatter changes (for proficiency bonus)
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        console.debug("Frontmatter changed, re-processing skills");
        this.processAndRender();
      })
    );
  }
}
