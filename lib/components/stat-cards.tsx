import { StatItem, StatsBlock } from "../types";
import { ReactNode } from "react";

export function StatCard({ item, dense }: { item: StatItem & { isProficient?: boolean }; dense?: boolean }) {
  return (
    <div className={`generic-card ${item.isProficient ? "proficient" : ""} ${dense ? "dense" : ""}`}>
      <div className="generic-card-label">{item.label}</div>
      <div className="generic-card-value">{item.value}</div>
      {item.sublabel && <div className="generic-card-sublabel">{item.sublabel}</div>}
    </div>
  );
}

interface StatGridProps {
  cols: number;
  children: ReactNode;
  dense?: boolean;
}

export function StatGrid({ cols, children, dense }: StatGridProps) {
  return (
    <div className={`card-grid ${dense ? "dense" : ""}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  );
}

export function StatsGridItems(data: StatsBlock) {
  const { items, grid } = data;
  const columns = grid?.columns || 3;
  const dense = data?.dense;

  return (
    <StatGrid cols={columns} dense={dense}>
      {items.map((item, index) => (
        <StatCard item={item} dense={dense} key={index} />
      ))}
    </StatGrid>
  );
}
