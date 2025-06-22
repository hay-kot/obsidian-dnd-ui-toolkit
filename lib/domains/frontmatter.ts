import { Frontmatter } from "lib/types";

export interface UnparsedFrontmatter {
  [key: string]: any;
}

/*
 * FrontMatterKeys defines the mapping of aliases to their standard frontmatter keys.
 * */
const FrontMatterKeys: Record<keyof Frontmatter, string[]> = {
  proficiency_bonus: ["proficiencyBonus", "Proficiency Bonus", "proficiency_bonus"],
  level: ["level", "Level"],
};

/**
 * Determines if the frontmatter contains a proficiency bonus or any of it's
 * aliased values
 * */
export function isProficiencyBonusInFrontmatter(fm: any): boolean {
  if (!fm || typeof fm !== "object") {
    return false;
  }

  const proficiencyBonusKeys = FrontMatterKeys.proficiency_bonus;
  for (const key of proficiencyBonusKeys) {
    if (fm[key] !== undefined && fm[key] !== null) {
      return true;
    }
    const lowered = key.toLowerCase();
    if (fm[lowered] !== undefined && fm[lowered] !== null) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates the proficiency bonus based on the character's level.
 * */
export function levelToProficiencyBonus(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function anyIntoFrontMatter(fm: UnparsedFrontmatter): Frontmatter {
  const frontmatter: Frontmatter = {
    proficiency_bonus: 2,
  };

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
  if (!isProficiencyBonusInFrontmatter(fm) && frontmatter.level !== undefined) {
    frontmatter.proficiency_bonus = levelToProficiencyBonus(frontmatter.level as number);
  }

  // Add all other frontmatter properties as-is
  for (const key in fm) {
    if (!(key in frontmatter)) {
      frontmatter[key] = fm[key];
    }
  }

  return frontmatter;
}
