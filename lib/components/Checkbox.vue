<script setup lang="ts">
const props = defineProps<{
  id: string;
  checked: boolean;
  className?: string;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    :id="props.id"
    :class="['dnd-ui-checkbox-button', 'clickable-icon', props.className ?? '']"
    :aria-pressed="props.checked"
    type="button"
    @click="emit('toggle')"
  />
</template>
