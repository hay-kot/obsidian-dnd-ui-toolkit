import { useState } from 'react';
import type { HealthBlock } from "lib/types";

export type HealthCardProps = {
	static: HealthBlock;
	state: {
		current: number;
		temporary: number;
		hitdiceUsed: number;
	}
}

export function HealthCard(props: HealthCardProps) {
	const [inputValue, setInputValue] = useState("");

	// Calculate health percentage for progress bar
	const healthPercentage = Math.max(0, Math.min(100, (props.state.current / props.static.health) * 100));

	// Handle hit dice rendering
	const renderHitDice = () => {
		const hitDiceArray = [];
		for (let i = 0; i < props.static.hitdice.value; i++) {
			hitDiceArray.push(
				<div key={i} className="hit-dice-wrapper">
					<input
						type="checkbox"
						checked={i < props.state.hitdiceUsed}
						id={`hit-dice-${i}`}
						className="hit-dice-checkbox"
					/>
					<label
						htmlFor={`hit-dice-${i}`}
						className="hit-dice-box"
					/>
				</div>
			);
		}
		return hitDiceArray;
	};

	return (
		<div className="health-card generic-card">
			<div className="health-card-header">
				<div className="generic-card-label">Hit Points</div>
				<div className="health-value">
					{props.state.current}
					<span className="health-max">
						/ {props.static.health}
					</span>
					{props.state.temporary > 0 && (
						<span className="health-temp">+{props.state.temporary} temp</span>
					)}
				</div>
			</div>

			<div className="health-progress-container">
				<div
					className="health-progress-bar"
					style={{ width: `${healthPercentage}%` }}
				/>
			</div>

			<div className="health-controls">
				<input
					type="number"
					className="health-input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="0"
					aria-label="Health points"
				/>
				<button type="button" className="health-button health-heal"> Heal </button>
				<button type="button" className="health-button health-damage"> Damage </button>
				<button type="button" className="health-button health-temp"> Temp HP </button>
			</div>

			<div className="health-divider" />

			<div className="hit-dice-container">
				<div style={{ display: "flex", alignItems: "center" }}>
					<p className="hit-dice-label">
						Hit Dice ({props.static.hitdice.dice})
					</p>
					<div className="hit-dice-boxes">
						{renderHitDice()}
					</div>
				</div>
			</div>
		</div>
	)
}
