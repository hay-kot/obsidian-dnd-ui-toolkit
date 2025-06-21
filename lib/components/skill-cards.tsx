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
    <div className="skills-grid">
      {props.items.map((item, index) => (
        <SkillItem item={item} key={index} />
      ))}
    </div>
  );
}

function SkillItem({ item }: { item: SkillItem }) {
  const getSkillCardClasses = () => {
    const classes = ["skill-card"];
    if (item.isExpert) {
      classes.push("expert");
    } else if (item.isProficient) {
      classes.push("proficient");
    } else if (item.isHalfProficient) {
      classes.push("half-proficient");
    }
    return classes.join(" ");
  };

  return (
    <div className={getSkillCardClasses()}>
      <div className="skills-values-container">
        <p className="skill-ability">
          <em>{item.ability}</em>
        </p>
        <p className="skill-name">{item.label}</p>
      </div>
      <div className="skills-values-container">
        <p className="skill-value">{AbilityService.formatModifier(item.modifier)}</p>
      </div>
    </div>
  );
}
