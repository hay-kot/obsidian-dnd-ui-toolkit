export type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export function Checkbox({ id, checked, onChange, className }: CheckboxProps) {
  return (
    <button
      id={id}
      className={`checkbox-button clickable-icon ${className || ""}`}
      onClick={onChange}
      aria-pressed={checked}
      type="button"
    />
  );
}
