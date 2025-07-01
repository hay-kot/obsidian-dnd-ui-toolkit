import { AbilityBlock, GenericBonus, AbilityScores } from "lib/types";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Utils from "lib/utils/utils";
import { parse } from "yaml";

export function parseAbilityBlockFromDocument(el: HTMLElement, ctx: MarkdownPostProcessorContext): AbilityBlock {
  // Extract all ability code blocks from the document
  const sectionInfo = ctx.getSectionInfo(el);
  const documentText = sectionInfo?.text || "";
  const codeblocks = documentText.match(/```ability[\s\S]*?```/g);

  if (!codeblocks) {
    throw new Error("No ability code blocks found");
  }

  const first = codeblocks[0];

  // prepare contents
  const contents = first.replace(/```ability|```/g, "").trim();
  return parseAbilityBlock(contents);
}

export function parseAbilityBlock(yamlString: string): AbilityBlock {
  const def: AbilityBlock = {
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
