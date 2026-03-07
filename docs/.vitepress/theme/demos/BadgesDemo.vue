<script setup lang="ts">
import BadgesRow from "lib/components/BadgesRow.vue";
import type { BadgesBlock } from "lib/types";

const data: BadgesBlock = {
  items: [
    { label: "Race", value: "Half-Elf", sublabel: "" },
    { label: "Level", value: "7", sublabel: "" },
    { label: "Initiative", value: "+2", sublabel: "" },
    { label: "AC", value: "16", sublabel: "" },
    { label: "Spell Attack", value: "+7", sublabel: "" },
  ],
  grid: { columns: 5 },
};
</script>

<template>
  <div class="dnd-ui-demo">
    <BadgesRow :data="data" />
  </div>
</template>
