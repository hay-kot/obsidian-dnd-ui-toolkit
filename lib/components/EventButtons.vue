<script setup lang="ts">
import type { EventButtonsBlock } from "lib/types";

const props = defineProps<{
  config: EventButtonsBlock;
}>();

const emit = defineEmits<{
  click: [value: string | { event: string; amount: number }];
}>();
</script>

<template>
  <div class="dnd-ui-event-buttons-container">
    <button
      v-for="(button, index) in props.config.items"
      :key="index"
      class="dnd-ui-event-button"
      :title="`Trigger ${button.name} event`"
      @click="emit('click', button.value)"
    >
      <span class="dnd-ui-event-button-text">{{ button.name }}</span>
    </button>
  </div>
</template>
