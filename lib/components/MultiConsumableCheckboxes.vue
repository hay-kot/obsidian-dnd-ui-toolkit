<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ParsedConsumableBlock } from "lib/types";
import type { ConsumableState } from "lib/domains/consumables";
import ConsumableCheckboxes from "lib/components/ConsumableCheckboxes.vue";

const props = defineProps<{
  consumables: ParsedConsumableBlock[];
  states: Record<string, ConsumableState>;
}>();

const emit = defineEmits<{
  "update:stateChange": [stateKey: string, newState: ConsumableState];
}>();

const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!containerRef.value) return;

  let maxLabelLength = 0;
  props.consumables.forEach((consumable) => {
    if (consumable.label && consumable.label.length > maxLabelLength) {
      maxLabelLength = consumable.label.length;
    }
  });

  const labelWidthEm = Math.max(3, maxLabelLength * 0.55);
  containerRef.value.style.setProperty("--consumable-label-width", `${labelWidthEm}em`);
});
</script>

<template>
  <div ref="containerRef" class="dnd-ui-consumables-column">
    <div v-for="consumable in props.consumables" :key="consumable.state_key" class="dnd-ui-consumable-item">
      <ConsumableCheckboxes
        :static="consumable"
        :state="props.states[consumable.state_key] || { value: 0 }"
        @update:state="(newState: ConsumableState) => emit('update:stateChange', consumable.state_key, newState)"
      />
    </div>
  </div>
</template>
