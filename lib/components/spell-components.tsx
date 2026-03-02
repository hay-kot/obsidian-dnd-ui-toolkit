import { SpellComponentsBlock } from "../types";

export function SpellComponents({ data }: { data: SpellComponentsBlock }) {
  const { casting_time, range, components, duration } = data;

  return (
    <div className="dnd-ui-spell-components">
      {casting_time && (
        <div className="dnd-ui-spell-component-item">
          <span className="dnd-ui-spell-component-label">Casting Time</span>
          <span className="dnd-ui-spell-component-value">{casting_time}</span>
        </div>
      )}
      {range && (
        <div className="dnd-ui-spell-component-item">
          <span className="dnd-ui-spell-component-label">Range</span>
          <span className="dnd-ui-spell-component-value">{range}</span>
        </div>
      )}
      {components && (
        <div className="dnd-ui-spell-component-item">
          <span className="dnd-ui-spell-component-label">Components</span>
          <span className="dnd-ui-spell-component-value">{components}</span>
        </div>
      )}
      {duration && (
        <div className="dnd-ui-spell-component-item">
          <span className="dnd-ui-spell-component-label">Duration</span>
          <span className="dnd-ui-spell-component-value">{duration}</span>
        </div>
      )}
    </div>
  );
}
