import { AbilityBlock, AbilityScores, SavingThrowsBlock } from "./types";
import { StatGrid, StatCard } from "./components/stat-cards";
import * as AbilityService from "./domains/abilities";
import { calculateSavingThrow } from "./domains/saving-throws";

export function AbilityView(data: AbilityBlock) {
	const { abilities, modifiers } = data;
	const { strength, dexterity, constitution, intelligence, wisdom, charisma } = abilities;

	const abbreviate = (name: string) => {
		return name.substring(0, 3).toUpperCase();
	}

	const items = [
		{
			name: "Strength",
			baseValue: strength,
			totalValue: AbilityService.getTotalScore(strength, "strength", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "strength")
		},
		{
			name: "Dexterity",
			baseValue: dexterity,
			totalValue: AbilityService.getTotalScore(dexterity, "dexterity", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "dexterity")
		},
		{
			name: "Constitution",
			baseValue: constitution,
			totalValue: AbilityService.getTotalScore(constitution, "constitution", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "constitution")
		},
		{
			name: "Intelligence",
			baseValue: intelligence,
			totalValue: AbilityService.getTotalScore(intelligence, "intelligence", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "intelligence")
		},
		{
			name: "Wisdom",
			baseValue: wisdom,
			totalValue: AbilityService.getTotalScore(wisdom, "wisdom", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "wisdom")
		},
		{
			name: "Charisma",
			baseValue: charisma,
			totalValue: AbilityService.getTotalScore(charisma, "charisma", modifiers),
			modifiers: AbilityService.getModifiersForAbility(modifiers, "charisma")
		},
	];

	return (
		<div>
			<StatGrid cols={6}>
				{items.map((item) => (
					<div className="ability-score-card" key={item.name}>
						<div className="ability-header">
							<p className="ability-name">{abbreviate(item.name)}</p>
							<p className="ability-value">{item.totalValue}</p>
						</div>
						<p className="ability-modifier">
							{AbilityService.formatModifier(AbilityService.calculateModifier(item.totalValue))}
						</p>
					</div>
				))}
			</StatGrid>
		</div>
	)
}

export function SavingThrowsComponent({ data }: { data: SavingThrowsBlock }) {
	const { abilityScores, proficiencyBonus, proficiencies, bonuses = {} } = data;
	const abilities: Array<{ key: keyof AbilityScores, name: string, abbr: string }> = [
		{ key: "strength", name: "Strength", abbr: "STR" },
		{ key: "dexterity", name: "Dexterity", abbr: "DEX" },
		{ key: "constitution", name: "Constitution", abbr: "CON" },
		{ key: "intelligence", name: "Intelligence", abbr: "INT" },
		{ key: "wisdom", name: "Wisdom", abbr: "WIS" },
		{ key: "charisma", name: "Charisma", abbr: "CHA" }
	];

	const savingThrows = abilities.map(ability => {
		const isProficient = proficiencies.includes(ability.key);
		// @ts-expect-error - TypeScript doesn't know that ability.key is a key of AbilityScores
		const bonus = bonuses[ability.key] || 0;
		const savingThrowValue = calculateSavingThrow(
			ability.key,
			abilityScores,
			proficiencyBonus,
			isProficient,
			bonus
		);

		return {
			label: `${ability.name} Save`,
			value: AbilityService.formatModifier(savingThrowValue),
			sublabel: isProficient ? "Proficient" : undefined,
			isProficient
		};
	});

	return (
		<StatGrid cols={3}>
			{savingThrows.map((item, index) => (
				<StatCard item={item} key={index} />
			))}
		</StatGrid>
	);
}
