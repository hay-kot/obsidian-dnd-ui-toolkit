import { AbilityBlock, GenericBonus, AbilityScores } from "lib/types";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Utils from "lib/utils/utils";
import { parse } from "yaml";
import { extractFirstCodeBlock } from "../utils/codeblock-extractor";

export { calculateModifier, formatModifier } from "./dnd/modifiers";

export function parseAbilityBlockFromDocument(el: HTMLElement, ctx: MarkdownPostProcessorContext): AbilityBlock {
  const sectionInfo = ctx.getSectionInfo(el);
  const documentText = sectionInfo?.text || "";

  const abilityContent = extractFirstCodeBlock(documentText, "ability");

  if (!abilityContent) {
    throw new Error("No ability code blocks found");
  }

  return parseAbilityBlock(abilityContent);
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

export function getModifiersForAbility(modifiers: GenericBonus[], ability: keyof AbilityScores): GenericBonus[] {
  return modifiers.filter((mod) => mod.target === ability);
}

export function getTotalScore(baseScore: number, ability: keyof AbilityScores, modifiers: GenericBonus[]): number {
  const abilityModifiers = getModifiersForAbility(modifiers, ability).filter(
    (mod) => !mod.modifies || mod.modifies === "score"
  );
  const modifierTotal = abilityModifiers.reduce((sum, mod) => sum + mod.value, 0);
  return baseScore + modifierTotal;
}

export function getSavingThrowBonus(ability: keyof AbilityScores, modifiers: GenericBonus[]): number {
  const savingThrowModifiers = getModifiersForAbility(modifiers, ability).filter(
    (mod) => !mod.modifies || mod.modifies === "saving_throw"
  );
  return savingThrowModifiers.reduce((sum, mod) => sum + mod.value, 0);
}
