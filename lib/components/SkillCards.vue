<script setup lang="ts">
import type { SkillItem } from "../types";
import { formatModifier } from "../domains/dnd/modifiers";

defineProps<{
  items: SkillItem[];
}>();

function getSkillCardClasses(item: SkillItem): string[] {
  const classes = ["dnd-ui-skill-card"];
  if (item.isExpert) classes.push("dnd-ui-expert");
  else if (item.isProficient) classes.push("dnd-ui-proficient");
  else if (item.isHalfProficient) classes.push("dnd-ui-half-proficient");
  return classes;
}
</script>

<template>
  <div class="dnd-ui-skills-grid">
    <div v-for="(item, index) in items" :key="index" :class="getSkillCardClasses(item)">
      <div class="dnd-ui-skills-values-container">
        <p class="dnd-ui-skill-ability">
          <em>{{ item.ability }}</em>
        </p>
        <p class="dnd-ui-skill-name">{{ item.label }}</p>
      </div>
      <div class="dnd-ui-skills-values-container">
        <p class="dnd-ui-skill-value">{{ formatModifier(item.modifier) }}</p>
      </div>
    </div>
  </div>
</template>
