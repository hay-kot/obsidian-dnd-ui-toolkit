<script setup lang="ts">
import AbilityCards from "lib/components/AbilityCards.vue";

const abilities = [
  { label: "AGI", total: 14, modifier: "+2", isProficient: false, savingThrow: "14" },
  { label: "STR", total: 12, modifier: "+1", isProficient: false, savingThrow: "5" },
  { label: "FIN", total: 16, modifier: "+3", isProficient: false, savingThrow: "+5" },
  { label: "INS", total: 10, modifier: "+0", isProficient: false, savingThrow: "12" },
  { label: "PRE", total: 14, modifier: "+2", isProficient: false, savingThrow: "14" },
  { label: "KNO", total: 12, modifier: "+1", isProficient: false, savingThrow: "13" },
];
</script>

<template>
  <div class="dnd-ui-demo">
    <AbilityCards :abilities="abilities" />
  </div>
</template>
