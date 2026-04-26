import { describe, expect, it, vi, beforeEach } from "vitest";
import { RawSkillsView } from "./RawSkillsView";
import { App, MarkdownPostProcessorContext } from "obsidian";

const processTemplateMock = vi.fn((text: string, _context?: any) => text);
const mountMock = vi.fn();

vi.mock("./VueMarkdown", () => ({
  VueMarkdown: class {
    containerEl: HTMLElement;
    constructor(el: HTMLElement) {
      this.containerEl = el;
    }
    mount = mountMock;
    addUnloadFn = vi.fn();
  },
}));

vi.mock("./filecontext", () => ({
  useFileContext: vi.fn(() => ({
    onFrontmatterChange: vi.fn(() => vi.fn()),
    onAbilitiesChange: vi.fn(() => vi.fn()),
    frontmatter: vi.fn(() => ({ spd: 2 })),
    md: vi.fn(() => ({ getSectionInfo: vi.fn().mockReturnValue({ text: "" }) })),
  })),
}));

vi.mock("lib/utils/template", () => ({
  hasTemplateVariables: vi.fn((text: string) => text.includes("{{") && text.includes("}}")),
  processTemplate: (text: string, context: any) => processTemplateMock(text, context),
  createTemplateContext: vi.fn(() => ({
    frontmatter: { spd: 2 },
    abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    skills: { proficiencies: [], expertise: [], half_proficiencies: [], bonuses: [] },
  })),
}));

describe("RawSkillsView template support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    processTemplateMock.mockImplementation((text: string, context?: any) => {
      if (text === "{{add frontmatter.spd rank}}") {
        return String(Number(context?.frontmatter?.spd) + Number(context?.rank));
      }
      return text;
    });
  });

  it("resolves modifier templates with rank variable", () => {
    const view = new RawSkillsView({} as App);
    const el = document.createElement("div");
    const ctx = { addChild: vi.fn(), sourcePath: "test.md" } as unknown as MarkdownPostProcessorContext;

    view.render(
      `items:
  - label: Agility
    ability: SPD
    rank: 1
    modifier: "{{add frontmatter.spd rank}}"`,
      el,
      ctx
    );

    const child: any = (ctx.addChild as any).mock.calls[0][0];
    child.onload();

    expect(processTemplateMock).toHaveBeenCalledWith("{{add frontmatter.spd rank}}", expect.any(Object));
    const props = mountMock.mock.calls[0][1];
    expect(props.items[0].modifier).toBe(3);
  });
});
