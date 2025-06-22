import * as Handlebars from "handlebars";
import { AbilityScores, Frontmatter, SkillsBlock } from "../types";
import { parseAbilityBlockFromDocument, calculateModifier } from "../domains/abilities";
import { parseSkillsBlock } from "../domains/skills";
import { FileContext } from "../views/filecontext";

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
    const abilityBlock = parseAbilityBlockFromDocument(el, fileContext.md());
    abilities = abilityBlock.abilities;
  } catch (error) {
    // If no ability block found, use defaults
    console.debug("No ability block found, using default values");
  }

  try {
    // Try to parse skills from the document
    const sectionInfo = fileContext.md().getSectionInfo(el);
    const documentText = sectionInfo?.text || "";
    const skillsCodeblocks = documentText.match(/```skills[\s\S]*?```/g);

    if (skillsCodeblocks && skillsCodeblocks.length > 0) {
      const skillsContent = skillsCodeblocks[0].replace(/```skills|```/g, "").trim();
      skills = parseSkillsBlock(skillsContent);
    }
  } catch (error) {
    console.debug("No skills block found, using default values");
  }

  return {
    frontmatter,
    abilities,
    skills,
  };
}
