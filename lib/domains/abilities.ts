import { AbilityBlock, AbilityModifier, AbilityScores } from 'lib/types';
import { MarkdownPostProcessorContext } from 'obsidian';
import { parse } from 'yaml';

export function parseAbilityBlockFromDocument(el: HTMLElement, ctx: MarkdownPostProcessorContext): AbilityBlock {
	// Extract all ability code blocks from the document
	const sectionInfo = ctx.getSectionInfo(el);
	const documentText = sectionInfo?.text || "";
	const codeblocks = documentText.match(/```ability[\s\S]*?```/g);

	if (!codeblocks) {
		throw new Error("No ability code blocks found");
	}

	const first = codeblocks[0];

	// prepare contents
	const contents = first.replace(/```ability|```/g, '').trim();
	return parseAbilityBlock(contents);

}

export function parseAbilityBlock(yamlString: string): AbilityBlock {
	const parsed = parse(yamlString);
	const abilities = parsed.abilities || {};
	const modifiersArray = parsed.modifiers || [];
	const orZero = (value?: number) => {
		if (value === undefined) {
			return 0;
		}
		return value
	}
	const abilityScores: AbilityScores = {
		strength: orZero(abilities.strength),
		dexterity: orZero(abilities.dexterity),
		constitution: orZero(abilities.constitution),
		intelligence: orZero(abilities.intelligence),
		wisdom: orZero(abilities.wisdom),
		charisma: orZero(abilities.charisma),
	};
	// Parse modifiers
	const modifiers: AbilityModifier[] = Array.isArray(modifiersArray)
		? modifiersArray.filter(mod =>
			mod &&
			typeof mod.name === 'string' &&
			typeof mod.target === 'string' &&
			typeof mod.value === 'number' &&
			['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].includes(mod.target)
		)
		: [];
	return {
		id: parsed.id,
		abilities: abilityScores,
		modifiers: modifiers
	};
}

// Calculate ability modifier according to D&D 5e rules
export function calculateModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

// Format the modifier with + or - sign
export function formatModifier(modifier: number): string {
	return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Get modifiers for a specific ability
export function getModifiersForAbility(modifiers: AbilityModifier[], ability: keyof AbilityScores): AbilityModifier[] {
	return modifiers.filter(mod => mod.target === ability);
}

// Calculate total score including modifiers
export function getTotalScore(baseScore: number, ability: keyof AbilityScores, modifiers: AbilityModifier[]): number {
	const abilityModifiers = getModifiersForAbility(modifiers, ability);
	const modifierTotal = abilityModifiers.reduce((sum, mod) => sum + mod.value, 0);
	return baseScore + modifierTotal;
}
