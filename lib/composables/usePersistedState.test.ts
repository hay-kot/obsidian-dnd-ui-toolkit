import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { usePersistedState } from "./usePersistedState";
import type { KeyValueStore } from "lib/services/kv/kv";

function createMockKv(): KeyValueStore {
  const store = new Map<string, unknown>();
  return {
    get: vi.fn(async <T>(key: string) => store.get(key) as T | undefined),
    set: vi.fn(async (key: string, value: unknown) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    keys: vi.fn(async () => Array.from(store.keys())),
    clear: vi.fn(async () => store.clear()),
    getAll: vi.fn(async () => Object.fromEntries(store)),
  } as unknown as KeyValueStore;
}

describe("usePersistedState", () => {
  let kv: KeyValueStore;

  beforeEach(() => {
    kv = createMockKv();
  });

  it("initializes with default value", () => {
    const TestComponent = defineComponent({
      setup() {
        const state = usePersistedState(kv, "test-key", 42);
        return { state };
      },
      template: "<div>{{ state }}</div>",
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.text()).toBe("42");
  });

  it("loads saved value on mount", async () => {
    await kv.set("test-key", 99);

    const TestComponent = defineComponent({
      setup() {
        const state = usePersistedState(kv, "test-key", 42);
        return { state };
      },
      template: "<div>{{ state }}</div>",
    });

    const wrapper = mount(TestComponent);
    await flushPromises();

    expect(wrapper.text()).toBe("99");
  });

  it("saves default value when no saved state exists", async () => {
    const TestComponent = defineComponent({
      setup() {
        const state = usePersistedState(kv, "new-key", 10);
        return { state };
      },
      template: "<div>{{ state }}</div>",
    });

    mount(TestComponent);
    await flushPromises();

    expect(kv.set).toHaveBeenCalledWith("new-key", 10);
  });

  it("persists changes to kv store on state mutation", async () => {
    const TestComponent = defineComponent({
      setup() {
        const state = usePersistedState(kv, "test-key", 0);
        return { state };
      },
      template: '<button @click="state = 77">Set</button>',
    });

    const wrapper = mount(TestComponent);
    await flushPromises();

    await wrapper.find("button").trigger("click");
    await nextTick();
    await flushPromises();

    expect(kv.set).toHaveBeenCalledWith("test-key", 77);
  });
});
