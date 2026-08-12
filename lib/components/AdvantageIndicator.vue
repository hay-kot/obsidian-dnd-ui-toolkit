<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { setIcon, setTooltip } from "obsidian";

const props = defineProps<{
  kind?: "advantage" | "disadvantage" | null;
  tooltip?: string;
}>();

const el = ref<HTMLElement | null>(null);

// The slot renders even with no kind so the value beside it stays in a fixed
// column whether or not a skill is flagged.
function render() {
  const node = el.value;
  if (!node) return;

  node.replaceChildren();
  if (!props.kind) return;

  setIcon(node, props.kind === "advantage" ? "chevrons-up" : "chevrons-down");
  if (props.tooltip) {
    // delay: 0 overrides Obsidian's default hover delay, which is too slow for
    // an indicator whose whole purpose is a quick glance.
    setTooltip(node, props.tooltip, { delay: 0 });
  }
}

onMounted(render);
watch(() => [props.kind, props.tooltip], render);
</script>

<template>
  <span
    ref="el"
    class="dnd-ui-adv-indicator"
    :class="{
      'dnd-ui-advantage': kind === 'advantage',
      'dnd-ui-disadvantage': kind === 'disadvantage',
    }"
    :role="kind ? 'img' : undefined"
    :aria-label="kind ? tooltip : undefined"
  ></span>
</template>
