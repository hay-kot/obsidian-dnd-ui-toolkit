import { StatGrid } from "./components/stat-cards";
import * as AbilityService from "./domains/abilities";

export type Ability = {
	label: string;
	total: number;
	modifier: number;
	isProficient: boolean;
	savingThrow: number;
}

export function AbilityView(data: Ability[]) {
	return (
		<div>
			<StatGrid cols={6}>
				{data.map((item) => (
					<div
						className={`ability-score-card ${item.isProficient ? 'proficient' : ''}`}
						key={item.label}>
						<div className="ability-header">
							<p className="ability-name">{item.label}</p>
							<p className="ability-value">{item.total}</p>
						</div>
						<p className="ability-modifier">
							{AbilityService.formatModifier(item.modifier)}
						</p>

						<div className="ability-modifier-saving">
							<em>
								Saving {AbilityService.formatModifier(item.savingThrow)}
							</em>
						</div>
					</div>
				))}
			</StatGrid>
		</div>
	)
}
