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

export function normalizePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}
