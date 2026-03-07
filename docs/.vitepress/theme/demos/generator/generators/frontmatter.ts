import type { CharacterData } from "../types";

export function generateFrontmatter(data: CharacterData): string {
  const lines = ["---"];
  lines.push(`proficiency_bonus: ${data.proficiencyBonus}`);
  lines.push(`level: ${data.level}`);
  lines.push("---");
  return lines.join("\n");
}
