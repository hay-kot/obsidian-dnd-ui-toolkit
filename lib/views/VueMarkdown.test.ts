import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defineComponent, h, ref, nextTick } from "vue";
import { VueMarkdown } from "./VueMarkdown";

const TestComponent = defineComponent({
  props: { message: String },
  setup(props) {
    return () => h("div", { class: "test" }, props.message);
  },
});

const AltComponent = defineComponent({
  props: { text: String },
  setup(props) {
    return () => h("span", { class: "alt" }, props.text);
  },
});

describe("VueMarkdown", () => {
  let container: HTMLElement;
  let vm: VueMarkdown;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // Add Obsidian's empty() method to the container
    (container as any).empty = function () {
      this.innerHTML = "";
    };
    vm = new VueMarkdown(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("mount() creates a Vue app and renders content", () => {
    vm.mount(TestComponent, { message: "Hello" });

    expect(container.querySelector(".test")).not.toBeNull();
    expect(container.textContent).toContain("Hello");
  });

  it("onunload() unmounts without error", () => {
    vm.mount(TestComponent, { message: "Hello" });
    expect(container.querySelector(".test")).not.toBeNull();

    vm.onunload();

    expect(container.textContent).toBe("");
  });

  it("mount() twice re-mounts (unmounts first app, renders second)", () => {
    vm.mount(TestComponent, { message: "First" });
    expect(container.textContent).toContain("First");

    vm.mount(AltComponent, { text: "Second" });
    expect(container.querySelector(".test")).toBeNull();
    expect(container.querySelector(".alt")).not.toBeNull();
    expect(container.textContent).toContain("Second");
  });

  it("addUnloadFn callbacks are called on unload", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    vm.addUnloadFn(fn1);
    vm.addUnloadFn(fn2);
    vm.onunload();

    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });

  it("mountReactive() renders with initial props", () => {
    const propsRef = ref<Record<string, unknown>>({ message: "Reactive" });
    vm.mountReactive(TestComponent, propsRef);

    expect(container.querySelector(".test")).not.toBeNull();
    expect(container.textContent).toContain("Reactive");
  });

  it("mountReactive() updates when ref changes", async () => {
    const propsRef = ref<Record<string, unknown>>({ message: "Before" });
    vm.mountReactive(TestComponent, propsRef);

    expect(container.textContent).toContain("Before");

    propsRef.value = { message: "After" };
    await nextTick();

    expect(container.textContent).toContain("After");
  });

  it("mountReactive() cleans up on unload", () => {
    const propsRef = ref<Record<string, unknown>>({ message: "Test" });
    vm.mountReactive(TestComponent, propsRef);

    expect(container.querySelector(".test")).not.toBeNull();

    vm.onunload();

    expect(container.textContent).toBe("");
  });
});
