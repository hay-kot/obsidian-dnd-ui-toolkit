export type Frontmatter = {
  proficiency_bonus: number;
  level?: number;
  [key: string]: any; // Allow other frontmatter properties
};

export type AbilityBlock = {
  abilities: AbilityScores;
  bonuses: GenericBonus[];
  proficiencies: string[];
};

export type AbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

// An GenericBonus is an additional property for the ability block
// that allows for custom additions to score points. This helps users
// add things from feats, or other sources that might modify the score.
export type GenericBonus = {
  name: string;
  target: keyof AbilityScores;
  value: number;
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

export type HealthBlock = {
  label: string;
  state_key: string;
  health: number | string; // Allow string for template support
  hitdice?: {
    dice: string;
    value: number;
  };
  death_saves?: boolean;
  reset_on?: string | string[]; // Event type(s) that trigger a reset, defaults to 'long-rest'
};

export type ConsumableBlock = {
  label: string;
  state_key: string;
  uses: number;
  reset_on?: string | string[]; // Event type(s) that trigger a reset (e.g., 'long-rest', ['short-rest', 'long-rest'])
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

export type InitiativeBlock = {
  state_key: string;
  items: InitiativeItem[];
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
  value: string; // The event type that gets dispatched
};

export type EventButtonsBlock = {
  items: EventButtonItem[];
};
