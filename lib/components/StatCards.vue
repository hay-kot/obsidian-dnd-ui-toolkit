<script setup lang="ts">
import type { StatsBlock } from "../types";

const props = defineProps<StatsBlock>();

const columns = props.grid?.columns || 3;
</script>

<template>
  <div
    :class="['dnd-ui-card-grid', { 'dnd-ui-dense': props.dense }]"
    :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }"
  >
    <div
      v-for="(item, index) in props.items"
      :key="index"
      :class="['dnd-ui-generic-card', { 'dnd-ui-dense': props.dense }]"
    >
      <div class="dnd-ui-generic-card-label">{{ item.label }}</div>
      <div class="dnd-ui-generic-card-value">{{ item.value }}</div>
      <div v-if="item.sublabel" class="dnd-ui-generic-card-sublabel">{{ item.sublabel }}</div>
    </div>
  </div>
</template>
