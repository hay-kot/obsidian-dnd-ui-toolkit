<script setup lang="ts">
import SkillCards from "lib/components/SkillCards.vue";
import type { SkillItem } from "lib/types";

const items: SkillItem[] = [
  { ability: "INT", label: "Arcana", modifier: 7, isProficient: true },
  { ability: "WIS", label: "Perception", modifier: 1 },
  { ability: "DEX", label: "Stealth", modifier: 4, isProficient: true },
  { ability: "CHA", label: "Deception", modifier: 5, isProficient: true },
  { ability: "DEX", label: "Acrobatics", modifier: 2 },
  { ability: "INT", label: "Investigation", modifier: 10, isExpert: true },
  { ability: "WIS", label: "Insight", modifier: 4, isProficient: true },
  { ability: "INT", label: "History", modifier: 5, isHalfProficient: true },
];
</script>

<template>
  <div class="dnd-ui-demo">
    <SkillCards :items="items" />
  </div>
</template>
