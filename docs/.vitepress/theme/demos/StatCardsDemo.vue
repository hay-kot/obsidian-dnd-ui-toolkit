<script setup lang="ts">
import StatCards from "lib/components/StatCards.vue";
</script>

<template>
  <div class="dnd-ui-demo">
    <StatCards
      :items="[
        { label: 'Armor Class', value: 16, sublabel: 'Mage Armor' },
        { label: 'Initiative', value: '+2' },
        { label: 'Spell DC', value: 15 },
      ]"
      :grid="{ columns: 3 }"
    />
  </div>
</template>
