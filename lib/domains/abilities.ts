import { AbilityBlock, GenericBonus, AbilityScores, RawAbilityBlock, RawAbilityScores } from "lib/types";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Utils from "lib/utils/utils";
import { parse } from "yaml";
import { extractFirstCodeBlock } from "../utils/codeblock-extractor";
import { hasTemplateVariables, processTemplate } from "../utils/template";

export function parseAbilityBlockFromDocument(el: HTMLElement, ctx: MarkdownPostProcessorContext): AbilityBlock {
  const sectionInfo = ctx.getSectionInfo(el);
  const documentText = sectionInfo?.text || "";

  const abilityContent = extractFirstCodeBlock(documentText, "ability");

  if (!abilityContent) {
    throw new Error("No ability code blocks found");
  }

  const rawBlock = parseAbilityBlock(abilityContent);
  // Process without template context to get pure numbers
  return processAbilityBlockTemplate(rawBlock, null);
}

export function parseAbilityBlock(yamlString: string): RawAbilityBlock {
  const def: RawAbilityBlock = {
    abilities: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    bonuses: [],
    proficiencies: [],
  };

  const parsed = parse(yamlString);
  return Utils.mergeWithDefaults(parsed, def);
}

// Process template variables in ability block and convert to numeric values
export function processAbilityBlockTemplate(
  rawBlock: RawAbilityBlock,
  templateContext: { frontmatter: any } | null,
  skipTemplateProcessing: boolean = false
): AbilityBlock {
  // If no template context or skip flag is set, try to convert all values to numbers directly
  if (!templateContext || skipTemplateProcessing) {
    return {
      abilities: convertRawAbilitiesToNumbers(rawBlock.abilities),
      bonuses: rawBlock.bonuses,
      proficiencies: rawBlock.proficiencies,
    };
  }

  const processedAbilities: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  // Process each ability score
  for (const [key, value] of Object.entries(rawBlock.abilities)) {
    const abilityKey = key as keyof AbilityScores;
    
    if (typeof value === "string" && hasTemplateVariables(value)) {
      // Process template with a minimal context to avoid circular dependencies
      const minimalContext = {
        frontmatter: templateContext.frontmatter,
        // Don't include abilities or skills to avoid recursion
        abilities: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0
        },
        skills: { proficiencies: [], expertise: [], half_proficiencies: [], bonuses: [] }
      };
      
      const processedValue = processTemplate(value, minimalContext);
      const numericValue = parseInt(processedValue, 10);
      
      if (!isNaN(numericValue)) {
        processedAbilities[abilityKey] = numericValue;
      } else {
        console.warn(
          `Template processed ability value "${processedValue}" for ${key} is not a valid number, using 0`
        );
        processedAbilities[abilityKey] = 0;
      }
    } else {
      // Direct numeric value or non-template string
      const numericValue = typeof value === "number" ? value : parseInt(String(value), 10);
      processedAbilities[abilityKey] = !isNaN(numericValue) ? numericValue : 0;
    }
  }

  return {
    abilities: processedAbilities,
    bonuses: rawBlock.bonuses,
    proficiencies: rawBlock.proficiencies,
  };
}

// Helper function to convert raw abilities to numbers without templates
function convertRawAbilitiesToNumbers(rawAbilities: RawAbilityScores): AbilityScores {
  return {
    strength: typeof rawAbilities.strength === "number" ? rawAbilities.strength : 0,
    dexterity: typeof rawAbilities.dexterity === "number" ? rawAbilities.dexterity : 0,
    constitution: typeof rawAbilities.constitution === "number" ? rawAbilities.constitution : 0,
    intelligence: typeof rawAbilities.intelligence === "number" ? rawAbilities.intelligence : 0,
    wisdom: typeof rawAbilities.wisdom === "number" ? rawAbilities.wisdom : 0,
    charisma: typeof rawAbilities.charisma === "number" ? rawAbilities.charisma : 0,
  };
}

// Calculate ability modifier according to D&D 5e rules
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Format the modifier with + or - sign
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Get modifiers for a specific ability
export function getModifiersForAbility(modifiers: GenericBonus[], ability: keyof AbilityScores): GenericBonus[] {
  return modifiers.filter((mod) => mod.target === ability);
}

// Calculate total score including modifiers that affect the score itself
export function getTotalScore(baseScore: number, ability: keyof AbilityScores, modifiers: GenericBonus[]): number {
  const abilityModifiers = getModifiersForAbility(modifiers, ability).filter(
    (mod) => !mod.modifies || mod.modifies === "score"
  ); // Only include score modifiers
  const modifierTotal = abilityModifiers.reduce((sum, mod) => sum + mod.value, 0);
  return baseScore + modifierTotal;
}

// Calculate saving throw bonus from modifiers that affect saving throws
export function getSavingThrowBonus(ability: keyof AbilityScores, modifiers: GenericBonus[]): number {
  const savingThrowModifiers = getModifiersForAbility(modifiers, ability).filter(
    (mod) => !mod.modifies || mod.modifies === "saving_throw"
  ); // Default to saving_throw if not specified
  return savingThrowModifiers.reduce((sum, mod) => sum + mod.value, 0);
}
