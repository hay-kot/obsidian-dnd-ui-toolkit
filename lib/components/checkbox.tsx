export type CheckboxProps = {
	id: string;
	checked: boolean;
	onChange: () => void;
}


export function Checkbox({ id, checked, onChange }: CheckboxProps) {
	return (
		<div className="hit-dice-wrapper">
			<button
				id={id}
				className="hit-dice-button"
				onClick={onChange}
				aria-pressed={checked}
				type="button"
			/>
		</div>
	)
}
