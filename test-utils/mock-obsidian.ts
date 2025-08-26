// Mock implementation of Obsidian API for testing

export class App {
  metadataCache: any;

  constructor() {
    this.metadataCache = {
      getCache: () => ({
        frontmatter: {},
      }),
    };
  }
}

export class MarkdownPostProcessorContext {
  sourcePath: string;

  constructor() {
    this.sourcePath = "test.md";
  }

  getSectionInfo(el: HTMLElement) {
    return {
      text: "",
    };
  }

  addChild(child: any) {
    // Mock implementation
  }
}

export class MarkdownRenderChild {
  containerEl: HTMLElement;

  constructor(el: HTMLElement) {
    this.containerEl = el;
  }

  onload() {
    // Mock implementation
  }

  onunload() {
    // Mock implementation
  }
}

export class Component {
  // Mock implementation
}
