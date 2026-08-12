<script setup lang="ts">
import { ref } from "vue";
import HealthCard from "lib/components/HealthCard.vue";
import type { ParsedHealthBlock } from "lib/types";
import { getDefaultHealthState, type HealthState } from "lib/domains/healthpoints";

const block: ParsedHealthBlock = {
  label: "Hit Points",
  state_key: "demo_temp_max_health",
  health: 24,
  temp_max_health: 5,
  death_saves: true,
};

const state = ref<HealthState>({ ...getDefaultHealthState(block), current: 26 });

function handleUpdate(newState: HealthState) {
  state.value = newState;
}
</script>

<template>
  <div class="dnd-ui-demo">
    <HealthCard :static="block" :state="state" @update:state="handleUpdate" />
  </div>
</template>
