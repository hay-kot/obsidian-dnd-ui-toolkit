<script setup lang="ts">
import type { BadgesBlock } from "../types";

const props = defineProps<{
  data: BadgesBlock;
}>();
</script>

<template>
  <div :class="['dnd-ui-badges-row', { 'dnd-ui-dense': props.data.dense }]">
    <div v-for="(item, index) in props.data.items" :key="index" class="dnd-ui-badge-item">
      <template v-if="item.reverse">
        <span v-if="item.value" class="dnd-ui-badge-value">{{ item.value }}</span>
        <span v-if="item.label" class="dnd-ui-badge-label">{{ item.label }}</span>
      </template>
      <template v-else>
        <span v-if="item.label" class="dnd-ui-badge-label">{{ item.label }}</span>
        <span v-if="item.value" class="dnd-ui-badge-value">{{ item.value }}</span>
      </template>
    </div>
  </div>
</template>
