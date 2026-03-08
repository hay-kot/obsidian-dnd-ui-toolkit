<script setup lang="ts">
import AbilityCards from "lib/components/AbilityCards.vue";

const abilities = [
  { label: "Agility", labelShort: "AGI", total: 14, modifier: "+2", isProficient: false, savingThrow: "Evasion 14" },
  { label: "Strength", labelShort: "STR", total: 12, modifier: "+1", isProficient: false, savingThrow: "Threshold 5" },
  { label: "Finesse", labelShort: "FIN", total: 16, modifier: "+3", isProficient: false, savingThrow: "Attack +5" },
  { label: "Instinct", labelShort: "INS", total: 10, modifier: "+0", isProficient: false, savingThrow: "Reaction 12" },
  { label: "Presence", labelShort: "PRE", total: 14, modifier: "+2", isProficient: false, savingThrow: "Influence 14" },
  { label: "Knowledge", labelShort: "KNO", total: 12, modifier: "+1", isProficient: false, savingThrow: "Recall 13" },
];
</script>

<template>
  <div class="dnd-ui-demo">
    <AbilityCards :abilities="abilities" :show-saving-prefix="false" />
  </div>
</template>
