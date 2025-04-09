import type { InitiativeBlock } from "lib/types";

export type InitiativeState = {
	initiative: number;
	hp: Record<string, number>;
}

export type InitiativeProps = {
	static: InitiativeBlock
	state: InitiativeState
}

export function Initiative(props: InitiativeProps) {
	return (
		<div></div>
	)
}
