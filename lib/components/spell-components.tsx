import { SpellComponentsBlock } from "../types";

export function SpellComponents({ data }: { data: SpellComponentsBlock }) {
  const { casting_time, range, components, duration } = data;

  return (
    <div className="spell-components">
      {casting_time && (
        <div className="spell-component-item">
          <span className="spell-component-label">Casting Time</span>
          <span className="spell-component-value">{casting_time}</span>
        </div>
      )}
      {range && (
        <div className="spell-component-item">
          <span className="spell-component-label">Range</span>
          <span className="spell-component-value">{range}</span>
        </div>
      )}
      {components && (
        <div className="spell-component-item">
          <span className="spell-component-label">Components</span>
          <span className="spell-component-value">{components}</span>
        </div>
      )}
      {duration && (
        <div className="spell-component-item">
          <span className="spell-component-label">Duration</span>
          <span className="spell-component-value">{duration}</span>
        </div>
      )}
    </div>
  );
}
