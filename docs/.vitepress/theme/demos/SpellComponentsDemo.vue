<script setup lang="ts">
import SpellComponents from "lib/components/SpellComponents.vue";
import type { SpellComponentsBlock } from "lib/types";

const data: SpellComponentsBlock = {
  casting_time: "1 action",
  range: "60 feet",
  components: "V, S, M (a pinch of sulfur)",
  duration: "Instantaneous",
  save: "dexterity",
  save_dc: 15,
  attack_bonus: 7,
};
</script>

<template>
  <div class="dnd-ui-demo">
    <SpellComponents :data="data" />
  </div>
</template>
