import { ref, onMounted, watch, type Ref } from "vue";
import type { KeyValueStore } from "lib/services/kv/kv";

export function usePersistedState<T>(kv: KeyValueStore, key: string, defaultValue: T): Ref<T> {
  const state = ref<T>(defaultValue) as Ref<T>;

  onMounted(async () => {
    const saved = await kv.get<T>(key);
    if (saved !== undefined) {
      state.value = saved;
    } else {
      await kv.set(key, defaultValue);
    }
  });

  watch(
    state,
    async (newVal) => {
      await kv.set(key, newVal);
    },
    { deep: true }
  );

  return state;
}
