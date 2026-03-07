import type { CharacterData, ClassDefinition } from "../types";
import { sanitizeStateKey } from "./utils";

export function generateSpellSlots(data: CharacterData, classDef: ClassDefinition): string | null {
  if (classDef.spellSlots.length === 0) return null;

  const prefix = sanitizeStateKey(data.name);
  const items: string[] = [];

  for (const slot of classDef.spellSlots) {
    const stateKey = `${prefix}_spells_${slot.level}`;
    const lines = [`  - label: "Level ${slot.level}"`, `    state_key: ${stateKey}`, `    uses: ${slot.slots}`];

    if (classDef.spellSlotResetOn) {
      const resetOn = classDef.spellSlotResetOn;
      if (Array.isArray(resetOn)) {
        lines.push("    reset_on:");
        for (const r of resetOn) {
          lines.push(`      - ${r}`);
        }
      } else {
        lines.push(`    reset_on: ${resetOn}`);
      }
    } else {
      lines.push("    reset_on: long-rest");
    }

    items.push(lines.join("\n"));
  }

  return "```consumable\nitems:\n" + items.join("\n") + "\n```";
}

export function generateClassConsumables(data: CharacterData, classDef: ClassDefinition): string | null {
  if (classDef.classConsumables.length === 0) return null;

  const prefix = sanitizeStateKey(data.name);
  const items: string[] = [];

  for (const con of classDef.classConsumables) {
    const stateKey = `${prefix}_${sanitizeStateKey(con.label)}`;
    const usesValue = typeof con.uses === "string" ? `'${con.uses}'` : con.uses;
    const lines = [`  - label: ${con.label}`, `    state_key: ${stateKey}`, `    uses: ${usesValue}`];

    if (Array.isArray(con.resetOn)) {
      lines.push("    reset_on:");
      for (const r of con.resetOn) {
        lines.push(`      - ${r}`);
      }
    } else {
      lines.push(`    reset_on: ${con.resetOn}`);
    }

    items.push(lines.join("\n"));
  }

  return "```consumable\nitems:\n" + items.join("\n") + "\n```";
}
