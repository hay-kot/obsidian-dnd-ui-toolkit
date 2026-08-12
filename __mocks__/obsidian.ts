import { vi } from "vitest";

export class MarkdownRenderChild {
  containerEl: HTMLElement;
  constructor(el: HTMLElement) {
    this.containerEl = el;
  }
  onunload() {}
}

export class App {}
export class Plugin {}
export class PluginSettingTab {}
export class Component {}

export const setIcon = vi.fn((parent: HTMLElement, iconId: string) => {
  // Mirrors Obsidian well enough for assertions: a marker child carrying the id.
  const svg = parent.ownerDocument.createElement("span");
  svg.classList.add("svg-icon");
  svg.setAttribute("data-icon", iconId);
  parent.appendChild(svg);
});

export const setTooltip = vi.fn();

export function normalizePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}
