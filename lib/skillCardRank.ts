import type { SkillItem } from "./types";

export const SKILL_RANK_MAX = 5;

/**
 * Clamps a numeric rank to the range used by skill card dots (0–5 inclusive).
 */
export function clampSkillRank(n: number): number {
  return Math.max(0, Math.min(SKILL_RANK_MAX, Math.floor(n)));
}

/**
 * Parses a YAML `rank` value; returns `undefined` when absent or invalid.
 */
export function parseSkillRank(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const n = Number(value);
  if (Number.isNaN(n)) {
    return undefined;
  }
  return clampSkillRank(n);
}

/**
 * Maps legacy `proficiency` string to rank when `rank` is not set.
 * half -> 2, proficient -> 3, expert -> 5, none/unknown/omit -> 0
 */
export function rankFromProficiencyString(proficiency: string | undefined): number {
  if (proficiency === undefined) {
    return 0;
  }
  switch (String(proficiency).toLowerCase()) {
    case "half":
      return 2;
    case "proficient":
      return 3;
    case "expert":
      return 5;
    case "none":
    case "unknown":
      return 0;
    default:
      return 0;
  }
}

function rankFromProficiencyFlags(item: SkillItem): number {
  if (item.isExpert) {
    return 5;
  }
  if (item.isProficient) {
    return 3;
  }
  if (item.isHalfProficient) {
    return 2;
  }
  return 0;
}

/**
 * Effective rank for display: explicit `item.rank` wins; otherwise uses legacy
 * `proficiency` (YAML string via RawSkillsView, or boolean flags from SkillsView).
 */
export function effectiveSkillRank(item: SkillItem): number {
  if (item.rank !== undefined) {
    return clampSkillRank(item.rank);
  }
  return rankFromProficiencyFlags(item);
}
