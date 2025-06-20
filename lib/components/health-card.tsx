import { useState } from 'react';
import type { HealthBlock } from "lib/types";
import { HealthState } from "lib/domains/healthpoints";
import { Checkbox } from "lib/components/checkbox";

export type HealthCardProps = {
	static: HealthBlock;
	state: HealthState;
	onStateChange: (newState: HealthState) => void;
}

export function HealthCard(props: HealthCardProps) {
	const [inputValue, setInputValue] = useState("1");

	// Calculate health percentage for progress bar
	const healthPercentage = Math.max(0, Math.min(100, (props.state.current / props.static.health) * 100));

	// Event handlers for health actions
	const handleHeal = () => {
		const value = parseInt(inputValue) || 0;
		if (value <= 0) return;

		const newCurrent = Math.min(props.state.current + value, props.static.health);
		const newState = {
			...props.state,
			current: newCurrent
		};

		// Reset death saves if health goes above 0
		if (newCurrent > 0 && props.state.current <= 0) {
			newState.deathSaveSuccesses = 0;
			newState.deathSaveFailures = 0;
		}

		props.onStateChange(newState);
		setInputValue("1");
	};

	const handleDamage = () => {
		const value = parseInt(inputValue) || 0;
		if (value <= 0) return;

		let newTemp = props.state.temporary;
		let newCurrent = props.state.current;

		// Apply damage to temporary HP first
		if (newTemp > 0) {
			if (value <= newTemp) {
				newTemp -= value;
			} else {
				const remainingDamage = value - newTemp;
				newTemp = 0;
				newCurrent = Math.max(0, newCurrent - remainingDamage);
			}
		} else {
			newCurrent = Math.max(0, newCurrent - value);
		}

		props.onStateChange({
			...props.state,
			current: newCurrent,
			temporary: newTemp
		});
		setInputValue("1");
	};

	const handleTempHP = () => {
		const value = parseInt(inputValue) || 0;
		if (value <= 0) return;

		// Only replace temporary HP if the new value is higher
		const newTemp = Math.max(props.state.temporary, value);

		props.onStateChange({
			...props.state,
			temporary: newTemp
		});
		setInputValue("1");
	};

	// Handle hit dice interaction
	const toggleHitDie = (index: number) => {
		const isUsed = index < props.state.hitdiceUsed;
		let newHitDiceUsed = props.state.hitdiceUsed;

		if (isUsed) {
			// Uncheck this die and all dice after it
			newHitDiceUsed = index;
		} else {
			// Check this die and all dice before it
			newHitDiceUsed = index + 1;
		}

		props.onStateChange({
			...props.state,
			hitdiceUsed: newHitDiceUsed
		});
	};

	// Handle death save interaction
	const toggleDeathSave = (type: 'success' | 'failure', index: number) => {
		const newState = { ...props.state };

		if (type === 'success') {
			const isChecked = index < props.state.deathSaveSuccesses;
			if (isChecked) {
				newState.deathSaveSuccesses = index;
			} else {
				newState.deathSaveSuccesses = index + 1;
			}
		} else {
			const isChecked = index < props.state.deathSaveFailures;
			if (isChecked) {
				newState.deathSaveFailures = index;
			} else {
				newState.deathSaveFailures = index + 1;
			}
		}

		props.onStateChange(newState);
	};

	// Handle hit dice rendering
	const renderHitDice = () => {
		if (!props.static.hitdice) return null;


		const hitDiceArray = [];
		for (let i = 0; i < props.static.hitdice.value; i++) {
			hitDiceArray.push(
				<Checkbox key={i} checked={i < props.state.hitdiceUsed} id={`hit-dice-${i}`} onChange={() => toggleHitDie(i)} />
			);
		}
		return hitDiceArray;
	};

	// Handle death saves rendering
	const renderDeathSaves = () => {
		if (!props.static.death_saves || props.state.current > 0) return null;

		const failures = [];
		const successes = [];

		// Render failures (left side)
		for (let i = 0; i < 3; i++) {
			failures.push(
				<Checkbox 
					key={`failure-${i}`} 
					checked={i < props.state.deathSaveFailures} 
					id={`death-save-failure-${i}`} 
					onChange={() => toggleDeathSave('failure', i)}
					className="death-save-failure"
				/>
			);
		}

		// Render successes (right side)
		for (let i = 0; i < 3; i++) {
			successes.push(
				<Checkbox 
					key={`success-${i}`} 
					checked={i < props.state.deathSaveSuccesses} 
					id={`death-save-success-${i}`} 
					onChange={() => toggleDeathSave('success', i)}
					className="death-save-success"
				/>
			);
		}

		return { failures, successes };
	};

	return (
		<div className="health-card generic-card">
			<div className="health-card-header">
				<div className="generic-card-label">
					{props.static.label || "Hit Points"}
				</div>
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
				<button
					type="button"
					className="health-button health-heal"
					onClick={handleHeal}
				>
					Heal
				</button>
				<button
					type="button"
					className="health-button health-damage"
					onClick={handleDamage}
				>
					Damage
				</button>
				<button
					type="button"
					className="health-button health-temp"
					onClick={handleTempHP}
				>
					Temp HP
				</button>
			</div>

			{props.static.hitdice && (
				<>
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
				</>
			)}

			{props.static.death_saves && props.state.current <= 0 && (
				<>
					<div className="health-divider" />
					<div className="death-saves-container">
						<div className="death-saves-tracker">
							<div className="death-saves-failures">
								{renderDeathSaves()?.failures}
							</div>
							<div className="death-saves-skull">💀</div>
							<div className="death-saves-successes">
								{renderDeathSaves()?.successes}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
