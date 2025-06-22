import { Frontmatter } from "lib/types";
import { MarkdownPostProcessorContext } from "obsidian";
import { App } from "obsidian";

const FrontMatterKeys: Record<keyof Frontmatter, string[]> = {
  proficiency_bonus: ["proficiencyBonus", "Proficiency Bonus", "proficiency_bonus"],
  level: ["level", "Level"],
};

export abstract class BaseView {
  public app: App;
  public abstract codeblock: string;

  constructor(app: App) {
    this.app = app;
  }

  // Changed return type from string to HTMLElement or void
  public abstract render(
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): HTMLElement | string | void;

  public register(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    const div = el.createEl("div");
    try {
      const result = this.render(source, el, ctx);

      // Handle different return types from render
      if (result instanceof HTMLElement) {
        div.appendChild(result);
      } else if (typeof result === "string") {
        div.innerHTML = result;
      } else {
        console.debug("No result to render");
      }
    } catch (e) {
      console.error("Error rendering code block", e);
      // Using a type assertion to handle the potential error type mismatch
      const errorMessage = e instanceof Error ? e.message : String(e);
      div.innerHTML = `<div class="notice">Error parsing stats block: ${errorMessage}</div>`;
    }
  }

  public frontmatter(ctx: MarkdownPostProcessorContext): Frontmatter {
    const frontmatter: Frontmatter = {
      proficiency_bonus: 2,
    };
    const fm = this.app.metadataCache.getCache(ctx.sourcePath)?.frontmatter;
    if (!fm) {
      return frontmatter;
    }

    // Handle known keys with specific mappings
    for (const key in FrontMatterKeys) {
      const keys = FrontMatterKeys[key];
      for (const k of keys) {
        if (fm[k] !== undefined) {
          // Try to parse numbers
          if (typeof fm[k] === "string" && !isNaN(Number(fm[k]))) {
            frontmatter[key as keyof Frontmatter] = Number(fm[k]);
          } else {
            frontmatter[key as keyof Frontmatter] = fm[k];
          }
          break;
        }
        const lowered = k.toLowerCase();
        if (fm[lowered] !== undefined) {
          // Try to parse numbers
          if (typeof fm[lowered] === "string" && !isNaN(Number(fm[lowered]))) {
            frontmatter[key as keyof Frontmatter] = Number(fm[lowered]);
          } else {
            frontmatter[key as keyof Frontmatter] = fm[lowered];
          }
          break;
        }
      }
    }

    // Auto-calculate proficiency bonus from level if proficiency bonus is not explicitly set
    if (!this.hasProficiencyBonusInFrontmatter(fm) && frontmatter.level !== undefined) {
      frontmatter.proficiency_bonus = this.calculateProficiencyBonus(frontmatter.level as number);
    }

    // Add all other frontmatter properties as-is
    for (const key in fm) {
      if (!(key in frontmatter)) {
        frontmatter[key] = fm[key];
      }
    }

    return frontmatter;
  }

  private hasProficiencyBonusInFrontmatter(fm: any): boolean {
    const proficiencyBonusKeys = FrontMatterKeys.proficiency_bonus;
    for (const key of proficiencyBonusKeys) {
      if (fm[key] !== undefined || fm[key.toLowerCase()] !== undefined) {
        return true;
      }
    }
    return false;
  }

  private calculateProficiencyBonus(level: number): number {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  }
}
