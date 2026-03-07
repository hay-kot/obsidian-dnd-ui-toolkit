export interface CharacterData {
  name: string;
  className: string;
  level: number;
  proficiencyBonus: number;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skillProficiencies: string[];
  savingThrows: string[];
  hitDice: string;
  baseHP: number;
  spellcastingAbility: string | null;
  spellSlots: SpellSlotConfig[];
  classConsumables: ClassConsumable[];
}

export interface SpellSlotConfig {
  level: number;
  slots: number;
}

export interface ClassConsumable {
  label: string;
  uses: number | string;
  resetOn: string | string[];
}

export interface ClassDefinition {
  name: string;
  hitDice: string;
  baseHP: number;
  savingThrows: [string, string];
  skillChoices: number;
  availableSkills: string[];
  spellcastingAbility: string | null;
  spellSlots: SpellSlotConfig[];
  spellSlotResetOn?: string | string[];
  classConsumables: ClassConsumable[];
  acTemplate: string | null;
  optimizedAbilities: CharacterData["abilities"];
}
