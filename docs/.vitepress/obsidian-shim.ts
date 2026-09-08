// The obsidian package ships types only ("main": ""), so anything importing it at runtime
// cannot be bundled for the docs site. This stands in for the handful of runtime helpers
// the demo components reach for.

/** Obsidian draws its own tooltip; in a plain browser the native one is the closest thing. */
export function setTooltip(el: HTMLElement, tooltip: string): void {
  el.setAttribute("title", tooltip);
}

/** No-op: the demos do not ship Obsidian's icon set. */
export function setIcon(): void {}
