import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkillsView } from "./SkillsView";
import { App, MarkdownPostProcessorContext } from "obsidian";

// Mock the React render function
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Mock the file context
vi.mock("./filecontext", () => ({
  useFileContext: vi.fn(() => ({
    frontmatter: vi.fn(() => ({
      proficiency_bonus: 3,
      expertise: [],
      proficiencies: [],
      half_proficiencies: [],
      jack_of_all_trades: false,
    })),
    filepath: "test.md",
    onAbilitiesChange: vi.fn((cb) => () => {}),
    onFrontmatterChange: vi.fn((cb) => () => {}),
    md: vi.fn(() => ({
      getSectionInfo: vi.fn(() => ({ text: "" })),
    })),
  })),
}));

describe("SkillsView", () => {
  let skillsView: SkillsView;
  let mockApp: App;
  let mockElement: HTMLElement;
  let mockContext: MarkdownPostProcessorContext;

  beforeEach(() => {
    mockApp = {} as App;
    skillsView = new SkillsView(mockApp);
    // Mock the element since we're in node environment
    mockElement = {
      createEl: vi.fn(() => ({ createEl: vi.fn() })),
    } as any;
    mockContext = {
      addChild: vi.fn(),
    } as any;
  });

  it("should render skills block without errors", () => {
    const skillsYaml = `proficiencies:
  - athletics
  - intimidation`;

    // Should not throw an error when creating the SkillsMarkdown component
    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();

    // Should call addChild to register the SkillsMarkdown component
    expect(mockContext.addChild).toHaveBeenCalled();
  });

  it("should render skills block with various proficiency types", () => {
    const skillsYaml = `proficiencies:
  - athletics
expertise:
  - insight
half_proficiencies:
  - history`;

    // Should not throw an error
    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();

    // Should call addChild to register the SkillsMarkdown component
    expect(mockContext.addChild).toHaveBeenCalled();
  });

  it("should render empty skills block", () => {
    const skillsYaml = `proficiencies: []`;

    // Should not throw an error
    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();

    // Should call addChild to register the SkillsMarkdown component
    expect(mockContext.addChild).toHaveBeenCalled();
  });
});
