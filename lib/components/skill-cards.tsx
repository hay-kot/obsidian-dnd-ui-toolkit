import * as AbilityService from "lib/domains/abilities";

export type SkillGridProps = {
  items: SkillItem[];
};

export type SkillItem = {
  isProficient?: boolean;
  isExpert?: boolean;
  isHalfProficient?: boolean;
  ability: string;
  label: string;
  modifier: number;
};

export function SkillGrid(props: SkillGridProps) {
  return (
    <div className="dnd-ui-skills-grid">
      {props.items.map((item, index) => (
        <SkillItem item={item} key={index} />
      ))}
    </div>
  );
}

function SkillItem({ item }: { item: SkillItem }) {
  const getSkillCardClasses = () => {
    const classes = ["dnd-ui-skill-card"];
    if (item.isExpert) {
      classes.push("dnd-ui-expert");
    } else if (item.isProficient) {
      classes.push("dnd-ui-proficient");
    } else if (item.isHalfProficient) {
      classes.push("dnd-ui-half-proficient");
    }
    return classes.join(" ");
  };

  return (
    <div className={getSkillCardClasses()}>
      <div className="dnd-ui-skills-values-container">
        <p className="dnd-ui-skill-ability">
          <em>{item.ability}</em>
        </p>
        <p className="dnd-ui-skill-name">{item.label}</p>
      </div>
      <div className="dnd-ui-skills-values-container">
        <p className="dnd-ui-skill-value">{AbilityService.formatModifier(item.modifier)}</p>
      </div>
    </div>
  );
}
