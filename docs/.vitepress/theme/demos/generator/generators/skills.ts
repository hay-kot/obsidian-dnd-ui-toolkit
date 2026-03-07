import type { CharacterData } from "../types";

export function generateSkills(data: CharacterData): string {
  const lines = ["```skills", "proficiencies:"];

  if (data.skillProficiencies.length === 0) {
    lines.push("  []");
  } else {
    for (const skill of data.skillProficiencies) {
      lines.push(`  - ${skill.toLowerCase()}`);
    }
  }

  lines.push("```");
  return lines.join("\n");
}
