import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkillsView } from "./SkillsView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as AbilityService from "../domains/abilities";

// Mock VueMarkdown to avoid DOM issues in Node environment
vi.mock("./VueMarkdown", () => ({
  VueMarkdown: vi.fn().mockImplementation(() => ({
    mount: vi.fn(),
  })),
}));

// Mock the file context
vi.mock("./filecontext", () => ({
  useFileContext: vi.fn(() => ({
    frontmatter: vi.fn(() => ({
      proficiency_bonus: 3,
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
    mockElement = {
      createEl: vi.fn(() => ({ createEl: vi.fn() })),
    } as any;
    mockContext = {
      addChild: vi.fn(),
    } as any;
  });

  it("should handle missing ability block gracefully", () => {
    const parseAbilityBlockSpy = vi.spyOn(AbilityService, "parseAbilityBlockFromDocument");
    parseAbilityBlockSpy.mockImplementation(() => {
      throw new Error("No ability code blocks found");
    });

    const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    const skillsYaml = `proficiencies:
  - athletics
  - intimidation`;

    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();
    expect(consoleDebugSpy).toHaveBeenCalledWith("No ability block found for skills view, using default values");

    parseAbilityBlockSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it("should use ability scores when ability block is found", () => {
    const parseAbilityBlockSpy = vi.spyOn(AbilityService, "parseAbilityBlockFromDocument");
    parseAbilityBlockSpy.mockReturnValue({
      abilities: {
        strength: 16,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
      },
      bonuses: [],
      proficiencies: [],
    });

    const skillsYaml = `proficiencies:
  - athletics`;

    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();

    parseAbilityBlockSpy.mockRestore();
  });

  it("should use default ability scores (10) when no ability block found", () => {
    const parseAbilityBlockSpy = vi.spyOn(AbilityService, "parseAbilityBlockFromDocument");
    parseAbilityBlockSpy.mockImplementation(() => {
      throw new Error("No ability code blocks found");
    });

    const skillsYaml = `proficiencies:
  - athletics`;

    expect(() => skillsView.render(skillsYaml, mockElement, mockContext)).not.toThrow();

    parseAbilityBlockSpy.mockRestore();
  });
});
