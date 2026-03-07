<script setup lang="ts">
import AbilityCards from "lib/components/AbilityCards.vue";

const abilities = [
  { label: "STR", total: 9, modifier: "-1", isProficient: false, savingThrow: "-1" },
  { label: "DEX", total: 14, modifier: "+2", isProficient: false, savingThrow: "+2" },
  { label: "CON", total: 14, modifier: "+2", isProficient: false, savingThrow: "+2" },
  { label: "INT", total: 19, modifier: "+4", isProficient: true, savingThrow: "+7" },
  { label: "WIS", total: 12, modifier: "+1", isProficient: true, savingThrow: "+4" },
  { label: "CHA", total: 10, modifier: "+0", isProficient: false, savingThrow: "+0" },
];
</script>

<template>
  <div class="dnd-ui-demo">
    <AbilityCards :abilities="abilities" />
  </div>
</template>
