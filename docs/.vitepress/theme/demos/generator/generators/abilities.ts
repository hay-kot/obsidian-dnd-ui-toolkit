import type { CharacterData, ClassDefinition } from "../types";

export function generateAbilities(data: CharacterData, classDef: ClassDefinition): string {
  const lines = [
    "```ability",
    "abilities:",
    `  strength: ${data.abilities.strength}`,
    `  dexterity: ${data.abilities.dexterity}`,
    `  constitution: ${data.abilities.constitution}`,
    `  intelligence: ${data.abilities.intelligence}`,
    `  wisdom: ${data.abilities.wisdom}`,
    `  charisma: ${data.abilities.charisma}`,
    "",
    "proficiencies:",
  ];

  for (const st of classDef.savingThrows) {
    lines.push(`  - ${st}`);
  }

  lines.push("```");
  return lines.join("\n");
}
