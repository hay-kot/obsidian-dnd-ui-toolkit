import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConsumableView } from "./ConsumableView";
import { App, MarkdownPostProcessorContext } from "obsidian";
import { KeyValueStore } from "lib/services/kv/kv";

// Track processTemplate calls to verify template resolution
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

describe("ConsumableView template resolution", () => {
  let view: ConsumableView;
  let mockApp: App;
  let kv: KeyValueStore;
  let mockElement: HTMLElement;
  let mockContext: MarkdownPostProcessorContext;

  beforeEach(() => {
    vi.clearAllMocks();
    processTemplateMock.mockImplementation((text: string) => text);

    mockApp = {} as App;
    kv = new KeyValueStore(new MockDataStore());
    view = new ConsumableView(mockApp, kv);

    mockElement = document.createElement("div");
    (mockElement as any).empty = function () {
      this.innerHTML = "";
    };
    mockElement.style.setProperty = vi.fn();

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

  it("should pass through numeric uses unchanged", async () => {
    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_1
    uses: 4`;

    await renderAndGetChild(yaml);

    // KV store should have been called with default state
    const state = await kv.get("spell_slots_1");
    expect(state).toEqual({ value: 0 });
    expect(processTemplateMock).not.toHaveBeenCalled();
  });

  it("should resolve template string in uses field", async () => {
    processTemplateMock.mockReturnValue("5");

    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_tmpl
    uses: "{{frontmatter.level}}"`;

    await renderAndGetChild(yaml);

    expect(processTemplateMock).toHaveBeenCalledWith("{{frontmatter.level}}", expect.any(Object));

    const state = await kv.get("spell_slots_tmpl");
    expect(state).toEqual({ value: 0 });
  });

  it("should fall back to 1 when template resolves to non-numeric value", async () => {
    processTemplateMock.mockReturnValue("not-a-number");

    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_nan
    uses: "{{frontmatter.missing}}"`;

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderAndGetChild(yaml);
    consoleSpy.mockRestore();

    expect(processTemplateMock).toHaveBeenCalled();
  });

  it("should fall back to 1 when template resolves to zero", async () => {
    processTemplateMock.mockReturnValue("0");

    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_zero
    uses: "{{frontmatter.missing}}"`;

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderAndGetChild(yaml);
    consoleSpy.mockRestore();

    expect(processTemplateMock).toHaveBeenCalled();
  });

  it("should fall back to 1 when template resolves to negative number", async () => {
    processTemplateMock.mockReturnValue("-3");

    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_neg
    uses: "{{subtract 1 4}}"`;

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await renderAndGetChild(yaml);
    consoleSpy.mockRestore();

    expect(processTemplateMock).toHaveBeenCalled();
  });

  it("should parse non-template string uses to a number", async () => {
    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_str
    uses: "7"`;

    await renderAndGetChild(yaml);

    // "7" doesn't contain template vars, so processTemplate should not be called
    expect(processTemplateMock).not.toHaveBeenCalled();
    const state = await kv.get("spell_slots_str");
    expect(state).toEqual({ value: 0 });
  });

  it("should fall back to 1 for unparseable non-template strings", async () => {
    const yaml = `items:
  - label: Spell Slots
    state_key: spell_slots_bad
    uses: "abc"`;

    await renderAndGetChild(yaml);

    expect(processTemplateMock).not.toHaveBeenCalled();
  });

  it("should handle multiple consumables with mixed template and numeric uses", async () => {
    processTemplateMock.mockReturnValue("3");

    const yaml = `items:
  - label: Slot 1
    state_key: slot_1
    uses: 4
  - label: Slot 2
    state_key: slot_2
    uses: "{{frontmatter.level}}"
  - label: Slot 3
    state_key: slot_3
    uses: 2`;

    await renderAndGetChild(yaml);

    // Only the template one should have called processTemplate
    expect(processTemplateMock).toHaveBeenCalledTimes(1);

    // All three should have state saved
    expect(await kv.get("slot_1")).toEqual({ value: 0 });
    expect(await kv.get("slot_2")).toEqual({ value: 0 });
    expect(await kv.get("slot_3")).toEqual({ value: 0 });
  });

  it("should use saved state when it exists in KV store", async () => {
    await kv.set("existing_key", { value: 2 });

    const yaml = `items:
  - label: Spell Slots
    state_key: existing_key
    uses: 4`;

    await renderAndGetChild(yaml);

    // Should NOT overwrite existing state
    const state = await kv.get("existing_key");
    expect(state).toEqual({ value: 2 });
  });
});
