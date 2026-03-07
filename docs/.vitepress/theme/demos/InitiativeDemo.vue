<script setup lang="ts">
import { ref } from "vue";
import Initiative from "lib/components/Initiative.vue";
import type { InitiativeBlock } from "lib/types";
import { getDefaultInitiativeState, type InitiativeState } from "lib/domains/initiative";

const block: InitiativeBlock = {
  state_key: "demo_initiative",
  items: [
    { name: "Gandalf", ac: 15, hp: 45 },
    { name: "Goblin", ac: 12, hp: { "Goblin 1": 7, "Goblin 2": 7, "Goblin 3": 7 } },
    { name: "Aragorn", ac: 18, hp: 52 },
  ],
  consumables: [{ label: "Legendary Actions", state_key: "demo_legendary", uses: 3, reset_on_round: true }],
};

const state = ref<InitiativeState>(getDefaultInitiativeState(block));

function handleUpdate(newState: InitiativeState) {
  state.value = newState;
}
</script>

<template>
  <div class="dnd-ui-demo">
    <Initiative :static="block" :state="state" @update:state="handleUpdate" />
  </div>
</template>
