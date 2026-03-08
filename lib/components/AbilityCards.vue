<script setup lang="ts">
interface AbilityCardItem {
  label: string;
  labelShort?: string;
  total: number;
  modifier: string;
  isProficient: boolean;
  savingThrow: string;
}

withDefaults(
  defineProps<{
    abilities: AbilityCardItem[];
    showSavingPrefix?: boolean;
  }>(),
  { showSavingPrefix: true }
);
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
          <p class="dnd-ui-ability-name">{{ item.labelShort || item.label }}</p>
          <p v-if="item.total" class="dnd-ui-ability-value">{{ item.total }}</p>
        </div>
        <p class="dnd-ui-ability-modifier">{{ item.modifier }}</p>
        <div class="dnd-ui-ability-modifier-saving">
          <em>{{ showSavingPrefix ? `Saving ${item.savingThrow}` : item.savingThrow }}</em>
        </div>
      </div>
    </div>
  </div>
</template>
