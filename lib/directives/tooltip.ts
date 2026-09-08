import { setTooltip } from "obsidian";
import type { Directive } from "vue";

// Obsidian draws its own tooltips and setTooltip is the API that registers one, so a
// plain title attribute is not a reliable way to get a tooltip inside the app.
function apply(el: HTMLElement, text: string | undefined) {
  if (text) {
    setTooltip(el, text);
  } else {
    el.removeAttribute("aria-label");
  }
}

/** Registers an Obsidian tooltip on an element, and removes it when the value goes empty. */
export const vTooltip: Directive<HTMLElement, string | undefined> = {
  mounted: (el, binding) => apply(el, binding.value),
  updated: (el, binding) => apply(el, binding.value),
};
