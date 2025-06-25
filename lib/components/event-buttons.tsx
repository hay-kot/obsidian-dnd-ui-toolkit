import { EventButtonsBlock } from "lib/types";

export type EventButtonsProps = {
  config: EventButtonsBlock;
  onButtonClick: (value: string | { event: string; amount: number }) => void;
};

export function EventButtons(props: EventButtonsProps) {
  const handleClick = (value: string | { event: string; amount: number }) => {
    props.onButtonClick(value);
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
          <span className="event-button-text">{button.name}</span>
        </button>
      ))}
    </div>
  );
}
