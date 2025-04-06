import { BadgeItem, BadgesBlock } from "../types";
import { ReactNode } from 'react';

export function Badge({ item }: { item: BadgeItem }) {
  return (
    <div className="badge-item">
      <span className="badge-label">{item.label}</span>
      <span className="badge-value">{item.value}</span>
    </div>
  )
}

export function BadgesRow({ data }: { data: BadgesBlock }) {
  const { items } = data;

  return (
    <div className="badges-row">
      {items.map((item, index) => (
        <Badge item={item} key={index} />
      ))}
    </div>
  )
}