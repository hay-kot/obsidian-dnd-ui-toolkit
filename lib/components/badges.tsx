import { BadgeItem, BadgesBlock } from "../types";

export function Badge({ item }: { item: BadgeItem }) {
  const els = [
    <>{item.label && <span className="badge-label">{item.label}</span>}</>,
    <>{item.value && <span className="badge-value">{item.value}</span>}</>,
  ];

  if (item.reverse) {
    els.reverse();
  }

  return <div className="badge-item">{els}</div>;
}

export function BadgesRow({ data }: { data: BadgesBlock }) {
  const { items, dense } = data;

  return (
    <div className={`badges-row${dense ? " dense" : ""}`}>
      {items.map((item, index) => (
        <Badge item={item} key={index} />
      ))}
    </div>
  );
}
