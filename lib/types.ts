import type { AbilityScores } from "./domains/dnd/types";
export type { AbilityScores } from "./domains/dnd/types";

export type Frontmatter = {
  proficiency_bonus: number;
  level?: number;
  spellcasting_ability?: string;
  character_file?: string;
  [key: string]: any; // Allow other frontmatter properties
};

export type AbilityBlock = {
  abilities: AbilityScores;
  bonuses: GenericBonus[];
  proficiencies: string[];
};

// An GenericBonus is an additional property for the ability block
// that allows for custom additions to score points. This helps users
// add things from feats, or other sources that might modify the score.
export type GenericBonus = {
  name: string;
  target: keyof AbilityScores;
  value: number;
  modifies?: "saving_throw" | "score"; // Defaults to 'saving_throw'
};

export type StatItem = {
  label: string;
  value: string | number;
  sublabel?: string;
};

export type StatsBlock = {
  items: StatItem[];
  grid?: {
    columns?: number;
  };
  dense?: boolean;
};

export type SkillsBlock = {
  proficiencies: string[];
  expertise: string[];
  half_proficiencies: string[];
  bonuses: SkillsBlockBonus[];
};

export type SkillsBlockBonus = GenericBonus;

export type HitDice = {
  dice: string;
  value: number;
};

export type RawHitDice = {
  dice: string;
  value: number | string; // Allow string for template support (e.g., "{{frontmatter.level}}")
};

export type HealthBlock = {
  label: string;
  state_key: string;
  health: number | string; // Allow string for template support
  hitdice?: RawHitDice | RawHitDice[]; // Support both single and multiple hit dice
  death_saves?: boolean | "always";
  reset_on?: string | string[]; // Event type(s) that trigger a reset, defaults to 'long-rest'
};

export type ResetConfig = {
  event: string;
  amount?: number; // If undefined, resets completely
};

export type ConsumableBlock = {
  label: string;
  state_key: string;
  uses: number | string; // Allow string for template support (e.g., "{{modifier abilities.charisma}}")
  reset_on?: string | string[] | { event: string; amount: number }[]; // Event type(s) that trigger a reset (e.g., 'long-rest', ['short-rest', 'long-rest'], [{event: 'short-rest', amount: 1}])
};

export type ParsedConsumableBlock = Omit<ConsumableBlock, "reset_on" | "uses"> & {
  uses: number; // Always resolved to a number after template processing
  reset_on?: ResetConfig[]; // Normalized to always be an array of objects
};

// Before template resolution — hitdice values may still be template strings
export type UnresolvedHealthBlock = Omit<HealthBlock, "reset_on" | "hitdice"> & {
  reset_on?: ResetConfig[];
  hitdice?: RawHitDice[];
};

// After template resolution — all values are numbers
export type ParsedHealthBlock = Omit<HealthBlock, "reset_on" | "hitdice" | "health"> & {
  health: number | string;
  reset_on?: ResetConfig[];
  hitdice?: HitDice[];
};

export type BadgeItem = {
  reverse?: boolean;
  label: string;
  value: string;
  sublabel: string;
};

export type BadgesBlock = {
  items: BadgeItem[];
  dense?: boolean;
  grid: {
    columns?: number;
  };
};

export type InitiativeConsumable = {
  label: string;
  state_key: string;
  uses: number;
  reset_on_round?: boolean;
};

export type InitiativeBlock = {
  state_key: string;
  items: InitiativeItem[];
  consumables?: InitiativeConsumable[];
};

export type InitiativeItem = {
  name: string;
  ac: number;
  link?: string;
  hp?: number | Record<string, number>;
};

export type SpellComponentsBlock = {
  casting_time?: string;
  range?: string;
  components?: string;
  duration?: string;
  save?: string;
  attack?: boolean;
  save_dc?: number;
  attack_bonus?: number;
};

export type SkillItem = {
  isProficient?: boolean;
  isExpert?: boolean;
  isHalfProficient?: boolean;
  ability: string;
  label: string;
  modifier: number;
};

export type Ability = {
  label: string;
  total: number;
  modifier: number;
  isProficient: boolean;
  savingThrow: number;
};

export type EventButtonItem = {
  name: string;
  value: string | { event: string; amount: number }; // The event type that gets dispatched, or object with event and amount
};

export type EventButtonsBlock = {
  items: EventButtonItem[];
};

// Re-export HealthState from healthpoints domain
export type { HealthState } from "./domains/healthpoints";
