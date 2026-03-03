<script setup lang="ts">
interface AbilityCardItem {
  label: string;
  total: number;
  modifier: string;
  isProficient: boolean;
  savingThrow: string;
}

defineProps<{
  abilities: AbilityCardItem[];
}>();
</script>

<template>
  <div class="dnd-ui-ability-scores-container">
    <div class="dnd-ui-ability-scores-grid">
      <div
        v-for="item in abilities"
        :key="item.label"
        :class="['dnd-ui-ability-score-card', { 'dnd-ui-proficient': item.isProficient }]"
      >
        <div class="dnd-ui-ability-header">
          <p class="dnd-ui-ability-name">{{ item.label }}</p>
          <p class="dnd-ui-ability-value">{{ item.total }}</p>
        </div>
        <p class="dnd-ui-ability-modifier">{{ item.modifier }}</p>
        <div class="dnd-ui-ability-modifier-saving">
          <em>Saving {{ item.savingThrow }}</em>
        </div>
      </div>
    </div>
  </div>
</template>
