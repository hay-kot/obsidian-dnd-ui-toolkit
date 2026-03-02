<script setup lang="ts">
import type { SpellComponentsBlock } from "../types";

const props = defineProps<{
  data: SpellComponentsBlock;
}>();
</script>

<template>
  <div class="dnd-ui-spell-components">
    <div v-if="props.data.casting_time" class="dnd-ui-spell-component-item">
      <span class="dnd-ui-spell-component-label">Casting Time</span>
      <span class="dnd-ui-spell-component-value">{{ props.data.casting_time }}</span>
    </div>
    <div v-if="props.data.range" class="dnd-ui-spell-component-item">
      <span class="dnd-ui-spell-component-label">Range</span>
      <span class="dnd-ui-spell-component-value">{{ props.data.range }}</span>
    </div>
    <div v-if="props.data.components" class="dnd-ui-spell-component-item">
      <span class="dnd-ui-spell-component-label">Components</span>
      <span class="dnd-ui-spell-component-value">{{ props.data.components }}</span>
    </div>
    <div v-if="props.data.duration" class="dnd-ui-spell-component-item">
      <span class="dnd-ui-spell-component-label">Duration</span>
      <span class="dnd-ui-spell-component-value">{{ props.data.duration }}</span>
    </div>
  </div>
</template>
