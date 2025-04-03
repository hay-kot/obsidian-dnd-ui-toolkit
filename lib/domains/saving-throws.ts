import { AbilityScores, SavingThrowsBlock } from "../types";
import { calculateModifier } from "./abilities";
import { parse } from 'yaml';

export function parseSavingThrowsBlock(yamlString: string): Partial<SavingThrowsBlock> {
	const parsed = parse(yamlString);

	// Get the proficiency bonus
	const proficiencyBonus = typeof parsed.proficiencyBonus === 'number' ? parsed.proficiencyBonus : 2;

	// Get the proficiencies (which abilities are proficient in saving throws)
	const proficiencies = Array.isArray(parsed.proficient)
		? parsed.proficient.filter((ability: string) =>
			["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].includes(ability)
		) as Array<keyof AbilityScores>
		: [];

	// Get any additional bonuses
	const bonuses = typeof parsed.bonuses === 'object' && parsed.bonuses !== null
		? parsed.bonuses as Record<keyof AbilityScores, number>
		: {};

	return {
		proficiencyBonus,
		proficiencies,
		// @ts-ignore
		bonuses,
		abilityBlockId: parsed.abilityBlock as string
	};
}

// Calculate saving throw value for a specific ability
export function calculateSavingThrow(
	ability: keyof AbilityScores,
	abilityScores: AbilityScores,
	proficiencyBonus: number,
	isProficient: boolean,
	additionalBonus = 0
): number {
	const abilityModifier = calculateModifier(abilityScores[ability]);
	const proficiencyValue = isProficient ? proficiencyBonus : 0;

	return abilityModifier + proficiencyValue + additionalBonus;
}

// Find an ability block from a collection of code blocks by ID
export function findAbilityBlockById(codeblocks: string[], targetId: string): AbilityScores | null {
	if (!codeblocks || !targetId) return null;

	for (const block of codeblocks) {
		console.log(block)
		const blockContent = block.replace(/```ability|```/g, '').trim();
		try {
			const abilityData = parse(blockContent);
			if (abilityData.id === targetId && abilityData.abilities) {
				// Found the referenced block, return its ability scores
				return {
					strength: abilityData.abilities.strength || 10,
					dexterity: abilityData.abilities.dexterity || 10,
					constitution: abilityData.abilities.constitution || 10,
					intelligence: abilityData.abilities.intelligence || 10,
					wisdom: abilityData.abilities.wisdom || 10,
					charisma: abilityData.abilities.charisma || 10
				};
			}
		} catch (e) {
			console.error("Error parsing ability block:", e);
		}
	}

	return null;
}
