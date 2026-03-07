<script setup lang="ts">
import { ref } from "vue";
import HealthCard from "lib/components/HealthCard.vue";
import type { ParsedHealthBlock } from "lib/types";
import { getDefaultHealthState, type HealthState } from "lib/domains/healthpoints";

const block: ParsedHealthBlock = {
  label: "Hit Points",
  state_key: "demo_health",
  health: 24,
  hitdice: [{ dice: "d6", value: 4 }],
  death_saves: "always",
};

const state = ref<HealthState>(getDefaultHealthState(block));

function handleUpdate(newState: HealthState) {
  state.value = newState;
}
</script>

<template>
  <div class="dnd-ui-demo">
    <HealthCard :static="block" :state="state" @update:state="handleUpdate" />
  </div>
</template>
