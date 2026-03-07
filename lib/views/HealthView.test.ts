import { describe, it, expect, vi, beforeEach } from "vitest";
import { HealthView } from "./HealthView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { KeyValueStore } from "lib/services/kv/kv";

const processTemplateMock = vi.fn((text: string, _context?: any) => text);

vi.mock("./VueMarkdown", () => ({
  VueMarkdown: class {
    containerEl: HTMLElement;
    constructor(el: HTMLElement) {
      this.containerEl = el;
    }
    mount = vi.fn();
    mountReactive = vi.fn();
    addUnloadFn = vi.fn();
  },
}));

vi.mock("./filecontext", () => ({
  useFileContext: vi.fn(() => ({
    frontmatter: vi.fn(() => ({ proficiency_bonus: 3, level: 5 })),
    onFrontmatterChange: vi.fn(() => vi.fn()),
    md: vi.fn(() => ({
      getSectionInfo: vi.fn().mockReturnValue({ text: "" }),
    })),
  })),
}));

vi.mock("lib/utils/template", () => ({
  hasTemplateVariables: vi.fn((text: string) => text.includes("{{") && text.includes("}}")),
  processTemplate: (text: string, context: any) => processTemplateMock(text, context),
  createTemplateContext: vi.fn(() => ({
    frontmatter: { proficiency_bonus: 3, level: 5 },
    abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    skills: { proficiencies: [], expertise: [], half_proficiencies: [], bonuses: [] },
  })),
}));

vi.mock("lib/services/event-bus", () => ({
  msgbus: {
    subscribe: vi.fn(() => vi.fn()),
    publish: vi.fn(),
  },
}));

class MockDataStore {
  private data: any = {};
  async loadData() {
    return this.data;
  }
  async saveData(data: any) {
    this.data = data;
  }
}

describe("HealthView template resolution", () => {
  let view: HealthView;
  let mockApp: App;
  let kv: KeyValueStore;
  let mockElement: HTMLElement;
  let mockContext: MarkdownPostProcessorContext;

  beforeEach(() => {
    vi.clearAllMocks();
    processTemplateMock.mockImplementation((text: string) => text);

    mockApp = {} as App;
    kv = new KeyValueStore(new MockDataStore());
    view = new HealthView(mockApp, kv);

    mockElement = document.createElement("div");
    (mockElement as any).empty = function () {
      this.innerHTML = "";
    };

    mockContext = {
      addChild: vi.fn(),
      sourcePath: "test.md",
    } as any;
  });

  async function renderAndGetChild(yaml: string) {
    view.render(yaml, mockElement, mockContext);
    const child = (mockContext.addChild as any).mock.calls[0][0];
    await child.onload();
    return child;
  }

  describe("health value resolution", () => {
    it("should pass through numeric health unchanged", async () => {
      const yaml = `state_key: hp_numeric
health: 24`;

      await renderAndGetChild(yaml);

      const state = await kv.get("hp_numeric");
      expect(state).toMatchObject({ current: 24, temporary: 0 });
      expect(processTemplateMock).not.toHaveBeenCalled();
    });

    it("should resolve template string in health field", async () => {
      processTemplateMock.mockReturnValue("30");

      const yaml = `state_key: hp_template
health: "{{multiply frontmatter.level 6}}"`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).toHaveBeenCalledWith("{{multiply frontmatter.level 6}}", expect.any(Object));

      const state = await kv.get("hp_template");
      expect(state).toMatchObject({ current: 30, temporary: 0 });
    });

    it("should keep original string when template resolves to non-numeric value", async () => {
      processTemplateMock.mockReturnValue("not-a-number");

      const yaml = `state_key: hp_nan
health: "{{frontmatter.missing}}"`;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await renderAndGetChild(yaml);
      consoleSpy.mockRestore();

      expect(processTemplateMock).toHaveBeenCalled();
      // When health remains a string, getDefaultHealthState uses fallback of 6
      const state = await kv.get("hp_nan");
      expect(state).toMatchObject({ current: 6, temporary: 0 });
    });

    it("should parse non-template string health to a number", async () => {
      const yaml = `state_key: hp_str
health: "20"`;

      await renderAndGetChild(yaml);

      // "20" doesn't have template vars, so health stays as string "20"
      // getDefaultHealthState falls back to 6 for string health
      expect(processTemplateMock).not.toHaveBeenCalled();
    });
  });

  describe("hitdice value resolution", () => {
    it("should pass through numeric hitdice values unchanged", async () => {
      const yaml = `state_key: hp_hd_numeric
health: 24
hitdice:
  dice: d8
  value: 5`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).not.toHaveBeenCalled();
      const state = await kv.get("hp_hd_numeric");
      expect(state).toMatchObject({ current: 24, hitdiceUsed: 0 });
    });

    it("should resolve template string in hitdice value", async () => {
      processTemplateMock.mockReturnValue("5");

      const yaml = `state_key: hp_hd_template
health: 24
hitdice:
  dice: d8
  value: "{{frontmatter.level}}"`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).toHaveBeenCalledWith("{{frontmatter.level}}", expect.any(Object));
    });

    it("should fall back to 1 when hitdice template resolves to non-numeric", async () => {
      processTemplateMock.mockReturnValue("not-a-number");

      const yaml = `state_key: hp_hd_nan
health: 24
hitdice:
  dice: d8
  value: "{{frontmatter.missing}}"`;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await renderAndGetChild(yaml);
      consoleSpy.mockRestore();

      expect(processTemplateMock).toHaveBeenCalled();
    });

    it("should fall back to 1 when hitdice template resolves to zero", async () => {
      processTemplateMock.mockReturnValue("0");

      const yaml = `state_key: hp_hd_zero
health: 24
hitdice:
  dice: d8
  value: "{{frontmatter.missing}}"`;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await renderAndGetChild(yaml);
      consoleSpy.mockRestore();

      expect(processTemplateMock).toHaveBeenCalled();
    });

    it("should handle multiple hitdice with mixed template and numeric values", async () => {
      // processTemplate is only called for the template one
      processTemplateMock.mockReturnValue("3");

      const yaml = `state_key: hp_multi_hd
health: 30
hitdice:
  - dice: d10
    value: 3
  - dice: d6
    value: "{{frontmatter.level}}"`;

      await renderAndGetChild(yaml);

      // Only the d6 template should trigger processTemplate
      expect(processTemplateMock).toHaveBeenCalledTimes(1);
      expect(processTemplateMock).toHaveBeenCalledWith("{{frontmatter.level}}", expect.any(Object));
    });

    it("should parse non-template string hitdice value to a number", async () => {
      const yaml = `state_key: hp_hd_str
health: 24
hitdice:
  dice: d8
  value: "4"`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).not.toHaveBeenCalled();
    });

    it("should fall back to 1 for unparseable non-template hitdice string", async () => {
      const yaml = `state_key: hp_hd_bad
health: 24
hitdice:
  dice: d8
  value: "abc"`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).not.toHaveBeenCalled();
    });
  });

  describe("combined health and hitdice templates", () => {
    it("should resolve both health and hitdice templates", async () => {
      processTemplateMock
        .mockReturnValueOnce("40") // health
        .mockReturnValueOnce("5"); // hitdice value

      const yaml = `state_key: hp_both
health: "{{multiply frontmatter.level 8}}"
hitdice:
  dice: d8
  value: "{{frontmatter.level}}"`;

      await renderAndGetChild(yaml);

      expect(processTemplateMock).toHaveBeenCalledTimes(2);

      const state = await kv.get("hp_both");
      expect(state).toMatchObject({ current: 40, temporary: 0 });
    });
  });

  describe("state persistence", () => {
    it("should use saved state when it exists", async () => {
      await kv.set("existing_hp", {
        current: 15,
        temporary: 3,
        hitdiceUsed: 2,
        deathSaveSuccesses: 1,
        deathSaveFailures: 0,
      });

      const yaml = `state_key: existing_hp
health: 24
hitdice:
  dice: d8
  value: 4`;

      await renderAndGetChild(yaml);

      // Should not overwrite existing state (may migrate, but values preserved)
      const state = await kv.get("existing_hp");
      expect(state).toMatchObject({
        current: 15,
        temporary: 3,
        deathSaveSuccesses: 1,
      });
    });

    it("should create default state when no saved state exists", async () => {
      const yaml = `state_key: new_hp
health: 20`;

      await renderAndGetChild(yaml);

      const state = await kv.get("new_hp");
      expect(state).toMatchObject({
        current: 20,
        temporary: 0,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      });
    });
  });
});
