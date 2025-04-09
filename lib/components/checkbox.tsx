export type CheckboxProps = {
	id: string;
	checked: boolean;
	onChange: () => void;
}


export function Checkbox({ id, checked, onChange }: CheckboxProps) {
	return (
		<button
			id={id}
			className="checkbox-button clickable-icon"
			onClick={onChange}
			aria-pressed={checked}
			type="button"
		/>
	)
}
