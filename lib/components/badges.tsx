import { BadgeItem, BadgesBlock } from "../types";

export function Badge({ item }: { item: BadgeItem }) {
  const els = [
    <>{item.label && <span className="dnd-ui-badge-label">{item.label}</span>}</>,
    <>{item.value && <span className="dnd-ui-badge-value">{item.value}</span>}</>,
  ];

  if (item.reverse) {
    els.reverse();
  }

  return <div className="dnd-ui-badge-item">{els}</div>;
}

export function BadgesRow({ data }: { data: BadgesBlock }) {
  const { items, dense } = data;

  return (
    <div className={`dnd-ui-badges-row${dense ? " dnd-ui-dense" : ""}`}>
      {items.map((item, index) => (
        <Badge item={item} key={index} />
      ))}
    </div>
  );
}
