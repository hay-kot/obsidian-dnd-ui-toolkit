import * as AbilityService from "lib/domains/abilities"

export type SkillGridProps = {
	items: SkillItem[];
}

export type SkillItem = {
	isProficient?: boolean;
	ability: string;
	label: string;
	modifier: number;
}

export function SkillGrid(props: SkillGridProps) {
	return (
		<div className="skills-grid">
			{props.items.map((item, index) => (
				<SkillItem item={item} key={index} />
			))}
		</div>
	)
}

function SkillItem({ item }: { item: SkillItem }) {
	return (
		<div className={`skill-card ${item.isProficient ? 'proficient' : ''}`}>
			<div className="skills-values-container">
				<p className="skill-ability">
					<em>
						{item.ability}
					</em>
				</p>
				<p className="skill-name">{item.label}</p>
			</div>
			<div className="skills-values-container">
				<p className="skill-value">
					{AbilityService.formatModifier(item.modifier)}
				</p>
			</div>
		</div>
	)
}
