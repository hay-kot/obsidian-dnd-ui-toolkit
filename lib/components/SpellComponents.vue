<script setup lang="ts">
import type { SpellComponentsBlock } from "../types";
import { formatModifier } from "../domains/dnd/modifiers";

const props = defineProps<{
  data: SpellComponentsBlock;
}>();

const hasAccent = props.data.save_dc != null || props.data.attack_bonus != null;

const saveLabel = props.data.save ? props.data.save.substring(0, 3).toUpperCase() + " Save" : "";

const fields = [
  { label: "Casting Time", value: props.data.casting_time },
  { label: "Range", value: props.data.range },
  { label: "Components", value: props.data.components },
  { label: "Duration", value: props.data.duration },
].filter((f) => f.value);
</script>

<template>
  <div class="dnd-ui-spell-components" :class="{ 'has-accent': hasAccent }">
    <div v-if="hasAccent" class="dnd-ui-spell-accent">
      <div v-if="props.data.save_dc != null" class="dnd-ui-spell-accent-item">
        <span class="dnd-ui-spell-accent-value">DC {{ props.data.save_dc }}</span>
        <span class="dnd-ui-spell-accent-label">{{ saveLabel }}</span>
      </div>
      <div v-if="props.data.attack_bonus != null" class="dnd-ui-spell-accent-item">
        <span class="dnd-ui-spell-accent-value">{{ formatModifier(props.data.attack_bonus) }}</span>
        <span class="dnd-ui-spell-accent-label">Spell Atk</span>
      </div>
    </div>
    <div class="dnd-ui-spell-grid">
      <div v-for="field in fields" :key="field.label" class="dnd-ui-spell-grid-item">
        <span class="dnd-ui-spell-grid-label">{{ field.label }}</span>
        <span class="dnd-ui-spell-grid-value">{{ field.value }}</span>
      </div>
    </div>
  </div>
</template>
