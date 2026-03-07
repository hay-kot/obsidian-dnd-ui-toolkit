<script setup lang="ts">
import { ref } from "vue";
import MultiConsumableCheckboxes from "lib/components/MultiConsumableCheckboxes.vue";
import type { ParsedConsumableBlock } from "lib/types";
import type { ConsumableState } from "lib/domains/consumables";

const consumables: ParsedConsumableBlock[] = [
  { label: "Level 1", state_key: "demo_spell_1", uses: 4 },
  { label: "Level 2", state_key: "demo_spell_2", uses: 3 },
  { label: "Level 3", state_key: "demo_spell_3", uses: 2 },
  { label: "Arcane Recovery", state_key: "demo_arcane_recovery", uses: 1 },
];

const states = ref<Record<string, ConsumableState>>({
  demo_spell_1: { value: 0 },
  demo_spell_2: { value: 0 },
  demo_spell_3: { value: 0 },
  demo_arcane_recovery: { value: 0 },
});

function handleStateChange(stateKey: string, newState: ConsumableState) {
  states.value = { ...states.value, [stateKey]: newState };
}
</script>

<template>
  <div class="dnd-ui-demo">
    <MultiConsumableCheckboxes :consumables="consumables" :states="states" @update:state-change="handleStateChange" />
  </div>
</template>
