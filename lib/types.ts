export type Frontmatter = {
	proficiencyBonus: number;
}

export type AbilityBlock = {
	abilities: AbilityScores;
	bonuses: GenericBonus[];
	proficiencies: string[];
}

export type AbilityScores = {
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
}

// An GenericBonus is an additional property for the ability block
// that allows for custom additions to score points. This helps users
// add things from feats, or other sources that might modify the score.
export type GenericBonus = {
	name: string;
	target: keyof AbilityScores;
	value: number;
}

export type StatItem = {
	label: string;
	value: string | number;
	sublabel?: string;
}

export type StatsBlock = {
	items: StatItem[];
	grid?: {
		columns?: number;
	};
}

export type SkillsBlock = {
	proficiencies: string[]
	bonuses: SkillsBlockBonus[]
}

export type SkillsBlockBonus = GenericBonus
