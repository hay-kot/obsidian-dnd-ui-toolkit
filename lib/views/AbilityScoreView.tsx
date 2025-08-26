import * as Tmpl from "lib/html-templates";
import { AbilityView } from "lib/components/ability-cards";
import { BaseView } from "./BaseView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "lib/domains/abilities";
import { Ability, RawAbilityBlock, AbilityBlock } from "lib/types";
import { useFileContext, FileContext } from "./filecontext";
import { msgbus } from "lib/services/event-bus";
import { ReactMarkdown } from "./ReactMarkdown";
import * as ReactDOM from "react-dom/client";
import { hasTemplateVariables } from "lib/utils/template";

export class AbilityScoreView extends BaseView {
  public codeblock = "ability";

  public render(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const abilityMarkdown = new AbilityMarkdown(el, source, ctx, this.app);
    ctx.addChild(abilityMarkdown);
  }
}

class AbilityMarkdown extends ReactMarkdown {
  private source: string;
  private fileContext: FileContext;
  private originalRawBlock: RawAbilityBlock;
  private hasTemplates: boolean = false;

  constructor(el: HTMLElement, source: string, ctx: MarkdownPostProcessorContext, app: App) {
    super(el);
    this.source = source;
    this.fileContext = useFileContext(app, ctx);
    this.originalRawBlock = AbilityService.parseAbilityBlock(source);

    // Check if any abilities contain template variables
    this.hasTemplates = Object.values(this.originalRawBlock.abilities).some(
      (value) => typeof value === "string" && hasTemplateVariables(value)
    );
  }

  async onload() {
    // Set up frontmatter change listener if we have templates
    if (this.hasTemplates) {
      this.setupFrontmatterChangeListener();
    }

    // Process and render initial state
    this.processAndRender();
  }

  private processAndRender() {
    let abilityBlock: AbilityBlock;

    // Process templates if present
    if (this.hasTemplates) {
      const templateContext = {
        frontmatter: this.fileContext.frontmatter(),
      };
      abilityBlock = AbilityService.processAbilityBlockTemplate(this.originalRawBlock, templateContext);
    } else {
      // No templates, just convert to numbers
      abilityBlock = AbilityService.processAbilityBlockTemplate(this.originalRawBlock, null);
    }

    const data: Ability[] = [];
    const frontmatter = this.fileContext.frontmatter();

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

    // Publish abilities changed event
    msgbus.publish(this.fileContext.filepath, "abilities:changed", undefined);

    // Render the component
    this.renderComponent(data);
  }

  private renderComponent(data: Ability[]) {
    // Create or reuse a React root
    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.containerEl);
    }

    // For now, render using the existing HTML template approach
    // Could be refactored to use React components in the future
    this.containerEl.innerHTML = Tmpl.Render(AbilityView(data));
  }

  private setupFrontmatterChangeListener() {
    this.addUnloadFn(
      this.fileContext.onFrontmatterChange(() => {
        console.debug(`Frontmatter changed, re-processing ability templates`);
        this.processAndRender();
      })
    );
  }
}
