import { Frontmatter } from "lib/types";
import { levelToProficiencyBonus } from "./dnd/proficiency";

export interface UnparsedFrontmatter {
  [key: string]: unknown;
}

/*
 * FrontMatterKeys defines the mapping of aliases to their standard frontmatter keys.
 * */
const FrontMatterKeys: Record<keyof Frontmatter, string[]> = {
  proficiency_bonus: ["proficiencyBonus", "Proficiency Bonus", "proficiency_bonus"],
  level: ["level", "Level"],
  spellcasting_ability: ["spellcasting_ability", "spellcastingAbility", "Spellcasting Ability"],
  character_file: ["character_file", "characterFile", "Character File"],
};

/**
 * Determines if the frontmatter contains a proficiency bonus or any of it's
 * aliased values
 * */
export function isProficiencyBonusInFrontmatter(fm: unknown): boolean {
  if (typeof fm !== "object" || fm === null) {
    return false;
  }

  const record = fm as Record<string, unknown>;
  return FrontMatterKeys.proficiency_bonus.some((key) => record[key] != null || record[key.toLowerCase()] != null);
}

export { levelToProficiencyBonus } from "./dnd/proficiency";

export function anyIntoFrontMatter(fm: UnparsedFrontmatter): Frontmatter {
  const frontmatter: Frontmatter = {
    proficiency_bonus: 2,
  };

  // Handle known keys with specific mappings. Each alias is tried in its
  // authored casing first, then lowercased, and the first hit wins.
  for (const key of Object.keys(FrontMatterKeys) as (keyof Frontmatter)[]) {
    const aliases = FrontMatterKeys[key].flatMap((alias) => [alias, alias.toLowerCase()]);
    const match = aliases.find((alias) => fm[alias] !== undefined);
    if (match === undefined) continue;

    // Quoted YAML scalars arrive as strings, but level and proficiency bonus
    // are used arithmetically downstream, so coerce whatever parses.
    const value = fm[match];
    frontmatter[key] = typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value;
  }

  // Auto-calculate proficiency bonus from level if proficiency bonus is not explicitly set
  if (!isProficiencyBonusInFrontmatter(fm) && frontmatter.level !== undefined) {
    frontmatter.proficiency_bonus = levelToProficiencyBonus(frontmatter.level);
  }

  // Add all other frontmatter properties as-is
  for (const key in fm) {
    if (!(key in frontmatter)) {
      frontmatter[key] = fm[key];
    }
  }

  return frontmatter;
}
