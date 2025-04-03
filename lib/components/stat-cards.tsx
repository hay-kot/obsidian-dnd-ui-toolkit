import { StatItem, StatsBlock } from "../types";
import { ReactNode } from 'react';

export function StatCard({ item }: { item: StatItem & { isProficient?: boolean } }) {
	return (
		<div className={`generic-card ${item.isProficient ? 'proficient' : ''}`}>
			<div className="generic-card-label">{item.label}</div>
			<div className="generic-card-value">{item.value}</div>
			{item.sublabel && (
				<div className="generic-card-sublabel">{item.sublabel}</div>
			)}
		</div>
	)
}

interface StatGridProps {
	cols: number;
	children: ReactNode;
}

export function StatGrid({ cols, children }: StatGridProps) {
	return (
		<div className="card-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
			{children}
		</div>
	);
}


export function StatsGridItems(data: StatsBlock) {
	const { items, grid } = data;
	const columns = grid?.columns || 3;

	return (
		<StatGrid cols={columns}>
			{items.map((item, index) => (
				<StatCard item={item} key={index} />
			))}
		</StatGrid>
	)
}
