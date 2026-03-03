<script setup lang="ts">
import type { ParsedConsumableBlock } from "lib/types";
import type { ConsumableState } from "lib/domains/consumables";
import Checkbox from "lib/components/Checkbox.vue";

const props = defineProps<{
  static: ParsedConsumableBlock;
  state: ConsumableState;
}>();

const emit = defineEmits<{
  "update:state": [newState: ConsumableState];
}>();

function toggleUsage(index: number) {
  let newValue: number;

  if (index < props.state.value) {
    newValue = index;
  } else {
    newValue = index + 1;
  }

  emit("update:state", { value: newValue });
}
</script>

<template>
  <div class="dnd-ui-consumable-container">
    <span v-if="props.static.label" class="dnd-ui-consumable-label">{{ props.static.label }}</span>
    <div class="dnd-ui-consumable-boxes">
      <Checkbox
        v-for="i in props.static.uses"
        :key="i - 1"
        :checked="i - 1 < props.state.value"
        :id="`consumable-${props.static.state_key}-${i - 1}`"
        @toggle="toggleUsage(i - 1)"
      />
    </div>
  </div>
</template>
