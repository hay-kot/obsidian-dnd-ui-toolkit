import { calculateModifier } from "lib/domains/dnd/modifiers";
import type { CharacterData, ClassDefinition } from "../types";
import { sanitizeStateKey } from "./utils";

export function generateHealthpoints(data: CharacterData, classDef: ClassDefinition): string {
  const stateKey = sanitizeStateKey(data.name) + "_health";
  const conMod = calculateModifier(data.abilities.constitution);
  const hp = Math.max(1, classDef.baseHP + conMod);

  const lines = [
    "```healthpoints",
    `state_key: ${stateKey}`,
    `health: ${hp}`,
    "hitdice:",
    `  dice: ${classDef.hitDice}`,
    "  value: 1",
    "```",
  ];
  return lines.join("\n");
}
