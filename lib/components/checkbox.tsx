export type CheckboxProps = {
	id: string;
	checked: boolean;
	onChange: () => void;
}


export function Checkbox({ id, checked, onChange }: CheckboxProps) {
	return (
		<div className="hit-dice-wrapper">
			<input
				type="checkbox"
				checked={checked}
				id={id}
				className="hit-dice-checkbox"
				onChange={onChange}
			/>
			<label
				htmlFor={id}
				className="hit-dice-box"
			/>
		</div>
	)
}
