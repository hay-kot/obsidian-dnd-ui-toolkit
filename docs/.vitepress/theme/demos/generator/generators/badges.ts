import type { CharacterData, ClassDefinition } from "../types";

export function generateBadges(data: CharacterData, classDef: ClassDefinition): string {
  const items: string[] = [];

  items.push(`  - label: Level\n    value: '${data.level}'`);
  items.push(`  - label: Initiative\n    value: '+{{ modifier abilities.dexterity }}'`);

  const acTemplate = classDef.acTemplate ?? "{{ add 10 (modifier abilities.dexterity) }}";
  items.push(`  - label: AC\n    value: '${acTemplate}'`);

  if (classDef.spellcastingAbility) {
    const ability = classDef.spellcastingAbility;
    items.push(
      `  - label: Spell Save\n    value: '{{ add 8 frontmatter.proficiency_bonus (modifier abilities.${ability}) }}'`
    );
    items.push(
      `  - label: Spell Attack\n    value: '+{{ add frontmatter.proficiency_bonus (modifier abilities.${ability}) }}'`
    );
  }

  return "```badges\nitems:\n" + items.join("\n") + "\n```";
}
