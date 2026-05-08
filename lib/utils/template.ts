import * as Handlebars from "handlebars";
import { AbilityScores, Frontmatter, SkillsBlock } from "../types";
import { parseAbilityBlockFromDocument, calculateModifier, getTotalScore } from "../domains/abilities";
import { parseSkillsBlock } from "../domains/skills";
import { FileContext } from "../views/filecontext";
import { extractFirstCodeBlock } from "./codeblock-extractor";

export interface TemplateContext {
  frontmatter: Frontmatter;
  abilities: AbilityScores;
  skills: SkillsBlock;
}

function init() {
  // Register helper functions for math operations
  Handlebars.registerHelper("add", (...args: any[]) => {
    // Last argument is handlebars options object, filter it out
    const numbers = args
      .slice(0, -1)
      .map((n) => Number(n))
      .filter((n) => !isNaN(n));
    return numbers.reduce((sum, n) => sum + n, 0);
  });

  Handlebars.registerHelper("subtract", (a: number, b: number) => a - b);
  Handlebars.registerHelper("multiply", (a: number, b: number) => a * b);
  Handlebars.registerHelper("divide", (a: number, b: number) => a / b);
  Handlebars.registerHelper("floor", (a: number) => Math.floor(a));
  Handlebars.registerHelper("ceil", (a: number) => Math.ceil(a));
  Handlebars.registerHelper("round", (a: number) => Math.round(a));
  Handlebars.registerHelper("modifier", (score: number) => calculateModifier(score));

  // Text helpers
  Handlebars.registerHelper("strip-link", (a: string) => a.replace(/\[\[([^|]+)\|([^\]]+)\]\]/g, "$2"));
}

init();

export function hasTemplateVariables(text: string): boolean {
  return text.includes("{{") && text.includes("}}");
}

export function processTemplate(text: string, context: TemplateContext): string {
  if (!hasTemplateVariables(text)) {
    return text;
  }

  try {
    const template = Handlebars.compile(text);
    return template(context);
  } catch (error) {
    console.error("Template processing error:", error);
    return text; // Return original text if template processing fails
  }
}

/**
 * Coerces a (possibly template-processed) string into a number for numeric component
 * fields. Falls back to 0 when the value is not numeric. If the original source
 * contained template variables, a typo or compile failure can leave the result empty
 * or non-numeric — in that case we emit a console.warn so the failure leaves a
 * breadcrumb instead of silently rendering as 0.
 */
export function coerceNumericTemplate(processed: string, source: string): number {
  const trimmed = processed.trim();
  const n = Number(trimmed);
  if (trimmed !== "" && Number.isFinite(n)) return n;
  if (hasTemplateVariables(source)) {
    console.warn(
      `[dnd-ui-toolkit] Template did not resolve to a number: ${JSON.stringify(processed)} (from ${JSON.stringify(source)})`
    );
  }
  return 0;
}

export function createTemplateContext(el: HTMLElement, fileContext: FileContext): TemplateContext {
  const frontmatter = fileContext.frontmatter();

  let abilities: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  let skills: SkillsBlock = {
    proficiencies: [],
    expertise: [],
    half_proficiencies: [],
    bonuses: [],
  };

  try {
    // Try to parse abilities from the document
    const abilityBlock = parseAbilityBlockFromDocument(el, fileContext.md(), frontmatter);

    // Calculate total scores including bonuses that modify the score
    abilities = {
      strength: getTotalScore(abilityBlock.abilities.strength, "strength", abilityBlock.bonuses),
      dexterity: getTotalScore(abilityBlock.abilities.dexterity, "dexterity", abilityBlock.bonuses),
      constitution: getTotalScore(abilityBlock.abilities.constitution, "constitution", abilityBlock.bonuses),
      intelligence: getTotalScore(abilityBlock.abilities.intelligence, "intelligence", abilityBlock.bonuses),
      wisdom: getTotalScore(abilityBlock.abilities.wisdom, "wisdom", abilityBlock.bonuses),
      charisma: getTotalScore(abilityBlock.abilities.charisma, "charisma", abilityBlock.bonuses),
    };
  } catch (error) {
    // If no ability block found, use defaults
    console.debug("No ability block found, using default values");
    console.log("Error: ", error);
  }

  try {
    // Try to parse skills from the document
    const sectionInfo = fileContext.md().getSectionInfo(el);
    const documentText = sectionInfo?.text || "";

    const skillsContent = extractFirstCodeBlock(documentText, "skills");

    if (skillsContent) {
      skills = parseSkillsBlock(skillsContent);
    }
  } catch (error) {
    console.debug("No skills block found, using default values");
    console.log("Error: ", error);
  }

  return {
    frontmatter,
    abilities,
    skills,
  };
}
