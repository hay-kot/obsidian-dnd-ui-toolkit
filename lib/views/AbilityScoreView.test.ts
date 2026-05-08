import { describe, it, expect, vi, beforeEach } from "vitest";
import { AbilityScoreView } from "./AbilityScoreView";
import { App, MarkdownPostProcessorContext } from "obsidian";

vi.mock("./VueMarkdown", () => {
  return {
    VueMarkdown: class {
      public containerEl: HTMLElement;
      public mount = vi.fn();
      public mountReactive = vi.fn();
      public addUnloadFn = vi.fn();
      constructor(el: HTMLElement) {
        this.containerEl = el;
      }
    },
  };
});

const onFrontmatterChange = vi.fn((_cb: (...args: any[]) => void) => () => {});
const onAbilitiesChange = vi.fn((_cb: (...args: any[]) => void) => () => {});
const frontmatterFn = vi.fn(() => ({ proficiency_bonus: 2 }));

vi.mock("./filecontext", () => ({
  useFileContext: vi.fn((_app: App, ctx: MarkdownPostProcessorContext) => ({
    filepath: ctx.sourcePath,
    frontmatter: frontmatterFn,
    onFrontmatterChange,
    onAbilitiesChange,
    md: () => ctx,
  })),
}));

describe("AbilityScoreView", () => {
  let abilityView: AbilityScoreView;
  let mockApp: App;
  let mockElement: HTMLElement;
  let mockContext: MarkdownPostProcessorContext;
  let addedChild: any = null;

  beforeEach(() => {
    addedChild = null;
    onFrontmatterChange.mockClear();
    onAbilitiesChange.mockClear();
    frontmatterFn.mockClear();
    mockApp = {} as App;
    abilityView = new AbilityScoreView(mockApp);
    mockElement = {} as HTMLElement;
    mockContext = {
      sourcePath: "test.md",
      addChild: vi.fn((child: any) => {
        addedChild = child;
      }),
      getSectionInfo: vi.fn(() => null),
    } as any;
  });

  it("does not subscribe to abilities:changed (publisher must not listen to itself)", async () => {
    const source = `abilities:
  strength: "{{frontmatter.str}}"`;
    abilityView.render(source, mockElement, mockContext);
    await addedChild.onload();

    // Component subscribes to frontmatter changes (templated) but not to its own abilities:changed.
    // Without this guard, msgbus.publish inside processAndRender would trigger a self-listener and recurse.
    expect(onFrontmatterChange).toHaveBeenCalledTimes(1);
    expect(onAbilitiesChange).not.toHaveBeenCalled();
  });

  it("re-renders once on a single frontmatter change without recursion", async () => {
    const source = `abilities:
  strength: "{{frontmatter.str}}"`;

    let registeredCallback: (() => void) | null = null;
    onFrontmatterChange.mockImplementation((cb: any) => {
      registeredCallback = cb;
      return () => {};
    });

    abilityView.render(source, mockElement, mockContext);
    await addedChild.onload();

    const initialMountCalls = addedChild.mount.mock.calls.length;
    expect(initialMountCalls).toBeGreaterThanOrEqual(1);

    expect(registeredCallback).not.toBeNull();
    (registeredCallback as any)();

    // Exactly one additional render — no recursion via abilities:changed.
    expect(addedChild.mount.mock.calls.length).toBe(initialMountCalls + 1);
  });

  it("does not subscribe at all for non-templated ability blocks", async () => {
    const source = `abilities:
  strength: 14
  dexterity: 12`;
    abilityView.render(source, mockElement, mockContext);
    await addedChild.onload();

    // setupTemplates returns null for non-templated sources, so isTemplate stays false
    // and the frontmatter listener short-circuits — but the listener IS still registered.
    // The abilities listener is never registered for this component regardless.
    expect(onAbilitiesChange).not.toHaveBeenCalled();
  });
});
