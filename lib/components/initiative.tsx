import { useState } from 'react';
import type { InitiativeBlock, InitiativeItem } from "lib/types";
import { getSortedInitiativeItems, getMaxHp } from "lib/domains/initiative";

export type InitiativeState = {
	activeIndex: number;
	initiatives: Record<string, number>;
	hp: Record<string, Record<string, number>>;
}

export type InitiativeProps = {
	static: InitiativeBlock;
	state: InitiativeState;
	onStateChange: (newState: InitiativeState) => void;
}

export function Initiative(props: InitiativeProps) {
	const [inputValue, setInputValue] = useState<string>("1");

	const sortedItems = getSortedInitiativeItems(
		props.static.items,
		props.state.initiatives
	);

	const handleSetInitiative = (index: number, value: string) => {
		const initiativeValue = parseInt(value) || 0;
		const newInitiatives = { ...props.state.initiatives };
		newInitiatives[index.toString()] = initiativeValue;

		props.onStateChange({
			...props.state,
			initiatives: newInitiatives
		});
	};

	const handleDamage = (index: number, monsterKey: string, value: string) => {
		const damageValue = parseInt(value) || 0;
		if (damageValue <= 0) return;

		const newHp = { ...props.state.hp };
		if (!newHp[index.toString()]) newHp[index.toString()] = {};

		const currentHp = newHp[index.toString()][monsterKey] || 0;
		newHp[index.toString()] = {
			...newHp[index.toString()],
			[monsterKey]: Math.max(0, currentHp - damageValue)
		};

		props.onStateChange({
			...props.state,
			hp: newHp
		});
	};

	const handleHeal = (index: number, monsterKey: string, value: string) => {
		const healValue = parseInt(value) || 0;
		if (healValue <= 0) return;

		const newHp = { ...props.state.hp };
		if (!newHp[index.toString()]) newHp[index.toString()] = {};

		const currentHp = newHp[index.toString()][monsterKey] || 0;
		const item = props.static.items[index];
		const maxHp = getMaxHp(item, monsterKey);

		newHp[index.toString()] = {
			...newHp[index.toString()],
			[monsterKey]: Math.min(maxHp, currentHp + healValue)
		};

		props.onStateChange({
			...props.state,
			hp: newHp
		});
	};

	const handleNext = () => {
		if (sortedItems.length === 0) return;

		const currentActiveIndex = props.state.activeIndex;
		let nextActiveIndex = -1;

		// Find the index of the current active item in the sorted list
		const currentActiveItemIndex = sortedItems.findIndex(item => item.index === currentActiveIndex);

		if (currentActiveItemIndex === -1 || currentActiveItemIndex === sortedItems.length - 1) {
			// If no active item or at the end of the list, go to the first item
			nextActiveIndex = sortedItems[0].index;
		} else {
			// Otherwise, go to the next item
			nextActiveIndex = sortedItems[currentActiveItemIndex + 1].index;
		}

		props.onStateChange({
			...props.state,
			activeIndex: nextActiveIndex
		});
	};

	const handlePrev = () => {
		if (sortedItems.length === 0) return;

		const currentActiveIndex = props.state.activeIndex;
		let prevActiveIndex = -1;

		// Find the index of the current active item in the sorted list
		const currentActiveItemIndex = sortedItems.findIndex(item => item.index === currentActiveIndex);

		if (currentActiveItemIndex === -1 || currentActiveItemIndex === 0) {
			// If no active item or at the beginning of the list, go to the last item
			prevActiveIndex = sortedItems[sortedItems.length - 1].index;
		} else {
			// Otherwise, go to the previous item
			prevActiveIndex = sortedItems[currentActiveItemIndex - 1].index;
		}

		props.onStateChange({
			...props.state,
			activeIndex: prevActiveIndex
		});
	};

	const handleReset = () => {
		// Reset all initiatives to 0 and HP to max values
		const newInitiatives = { ...props.state.initiatives };
		const newHp: Record<string, Record<string, number>> = {};

		props.static.items.forEach((item, index) => {
			const indexStr = index.toString();
			newInitiatives[indexStr] = 0;
			newHp[indexStr] = {};

			if (typeof item.hp === 'number') {
				newHp[indexStr]['main'] = item.hp;
			} else if (item.hp && typeof item.hp === 'object') {
				Object.entries(item.hp).forEach(([key, value]) => {
					newHp[indexStr][key] = value as number;
				});
			}
		});

		props.onStateChange({
			...props.state,
			activeIndex: -1,
			initiatives: newInitiatives,
			hp: newHp
		});
	};

	// Render a single monster's HP
	const renderMonsterHp = (index: number, monsterKey: string, monsterLabel: string, maxHp: number) => {
		const currentHp = props.state.hp[index.toString()]?.[monsterKey] || 0;
		// Add status class based on health percentage
		const healthPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
		let statusClass = '';
		if (currentHp <= 0) {
			statusClass = 'monster-status-dead';
		} else if (healthPercent <= 33) {
			statusClass = 'monster-status-injured';
		} else if (healthPercent >= 90) {
			statusClass = 'monster-status-healthy';
		}

		return (
			<div key={`${index}-${monsterKey}`} className="initiative-monster">
				<div className="initiative-monster-header">
					<span className={`initiative-monster-name ${statusClass}`}>{monsterLabel}</span>
					<span className="initiative-monster-hp">
						<span className="initiative-hp-value">{currentHp}</span>
						<span className="initiative-hp-separator">/</span>
						<span className="initiative-hp-max">{maxHp}</span>
					</span>
				</div>
				<div className="initiative-monster-actions">
					<input
						type="number"
						className="initiative-hp-input"
						placeholder="0"
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<button
						className="initiative-hp-button initiative-damage"
						onClick={() => {
							handleDamage(index, monsterKey, inputValue);
							setInputValue("1");
						}}
						title="Damage"
					>
						−
					</button>
					<button
						className="initiative-hp-button initiative-heal"
						onClick={() => {
							handleHeal(index, monsterKey, inputValue);
							setInputValue("1");
						}}
						title="Heal"
					>
						+
					</button>
				</div>
			</div>
		);
	};

	// Render HP section based on whether it's a group or single monster
	const renderHpSection = (item: InitiativeItem, index: number) => {
		if (!item.hp) return null;

		const itemHp = props.state.hp[index.toString()] || {};
		const isGroup = typeof item.hp === 'object' && Object.keys(item.hp).length > 1;

		if (isGroup) {
			// It's a group of monsters with individual HP tracking
			return (
				<div className="initiative-group-hp">
					{Object.entries(item.hp as Record<string, number>).map(([key, maxHp]) =>
						renderMonsterHp(index, key, key, maxHp)
					)}
				</div>
			);
		} else {
			// It's a single monster
			const monsterKey = Object.keys(itemHp)[0] || 'main';
			const maxHp = getMaxHp(item);
			const currentHp = itemHp[monsterKey] || 0;

			// Status class based on health percentage
			const healthPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
			let statusClass = '';
			if (currentHp <= 0) {
				statusClass = 'monster-status-dead';
			} else if (healthPercent <= 33) {
				statusClass = 'monster-status-injured';
			}

			return (
				<div className={`initiative-hp ${statusClass}`}>
					<span className="initiative-hp-value">{currentHp}</span>
					<span className="initiative-hp-separator">/</span>
					<span className="initiative-hp-max">{maxHp}</span>
				</div>
			);
		}
	};

	// Render HP actions for single monster
	const renderHpActions = (item: InitiativeItem, index: number) => {
		if (!item.hp) return null;

		const itemHp = props.state.hp[index.toString()] || {};
		const isGroup = typeof item.hp === 'object' && Object.keys(item.hp).length > 1;

		if (isGroup) {
			// Actions for groups are rendered with each monster
			return null;
		} else {
			// Single monster actions
			const monsterKey = Object.keys(itemHp)[0] || 'main';

			return (
				<div className="initiative-item-actions">
					<input
						type="number"
						className="initiative-hp-input"
						placeholder="0"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<button
						className="initiative-hp-button initiative-damage"
						onClick={() => {
							handleDamage(index, monsterKey, inputValue);
							setInputValue("1");
						}}
						title="Damage"
					>
						−
					</button>
					<button
						className="initiative-hp-button initiative-heal"
						onClick={() => {
							handleHeal(index, monsterKey, inputValue);
							setInputValue("1");
						}}
						title="Heal"
					>
						+
					</button>
				</div>
			);
		}
	};

	return (
		<div className="initiative-tracker">
			<div className="initiative-tracker-controls">
				<button
					className="initiative-control-button initiative-prev"
					onClick={handlePrev}
					aria-label="Previous combatant"
				>
					◀ Prev
				</button>
				<button
					className="initiative-control-button initiative-next"
					onClick={handleNext}
					aria-label="Next combatant"
				>
					Next ▶
				</button>
				<button
					className="initiative-control-button initiative-reset"
					onClick={handleReset}
					aria-label="Reset initiative"
				>
					Reset
				</button>
			</div>

			<div className="initiative-list">
				{sortedItems.length === 0 ? (
					<div className="initiative-empty-state">No combatants added</div>
				) : (
					<div className="initiative-items">
						{sortedItems.map(({ item, index, initiative }) => {
							const isActive = index === props.state.activeIndex;
							const hasHp = item.hp !== undefined;
							const isGroupMonster = hasHp && typeof item.hp === 'object' && Object.keys(item.hp).length > 1;

							return (
								<div
									key={index}
									className={`initiative-item ${isActive ? 'initiative-item-active' : ''} ${isGroupMonster ? 'initiative-item-group' : ''}`}
								>
									<div className="initiative-item-main">
										<div className="initiative-roll">
											<input
												type="number"
												value={initiative || ""}
												onChange={(e) => handleSetInitiative(index, e.target.value)}
												className="initiative-input"
												placeholder="Init"
											/>
										</div>
										<div>
											<div className="initiative-name">
												{item.link ? (
													<a href={item.link} className="initiative-link">{item.name}</a>
												) : item.name}
											</div>
											<div className="initiative-ac">
												AC: <span className="initiative-ac-value">{item.ac}</span>
											</div>
										</div>

										{hasHp && !isGroupMonster && renderHpSection(item, index)}
									</div>

									{hasHp && !isGroupMonster && (
										<>
											<div className="divider"></div>
											{renderHpActions(item, index)}
										</>
									)}

									{isGroupMonster && (
										<>
											<div className="divider"></div>
											<div className="initiative-group-container">
												{renderHpSection(item, index)}
											</div>
										</>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
