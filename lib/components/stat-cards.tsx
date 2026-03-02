import { StatItem, StatsBlock } from "../types";
import { ReactNode } from "react";

export function StatCard({ item, dense }: { item: StatItem & { isProficient?: boolean }; dense?: boolean }) {
  return (
    <div className={`dnd-ui-generic-card ${item.isProficient ? "dnd-ui-proficient" : ""} ${dense ? "dnd-ui-dense" : ""}`}>
      <div className="dnd-ui-generic-card-label">{item.label}</div>
      <div className="dnd-ui-generic-card-value">{item.value}</div>
      {item.sublabel && <div className="dnd-ui-generic-card-sublabel">{item.sublabel}</div>}
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
    <div className={`dnd-ui-card-grid ${dense ? "dnd-ui-dense" : ""}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
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
