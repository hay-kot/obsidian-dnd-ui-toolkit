import { EventButtonsBlock } from "lib/types";

export type EventButtonsProps = {
  config: EventButtonsBlock;
  onButtonClick: (eventType: string) => void;
};

export function EventButtons(props: EventButtonsProps) {
  const handleClick = (eventType: string) => {
    props.onButtonClick(eventType);
  };

  return (
    <div className="event-buttons-container">
      {props.config.items.map((button, index) => (
        <button
          key={index}
          className="event-button"
          onClick={() => handleClick(button.value)}
          title={`Trigger ${button.name} event`}
        >
          {button.icon && <span className="event-button-icon">{button.icon}</span>}
          <span className="event-button-text">{button.name}</span>
        </button>
      ))}
    </div>
  );
}
