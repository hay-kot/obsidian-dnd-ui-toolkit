<script setup lang="ts">
import SkillCards from "lib/components/SkillCards.vue";
import type { SkillItem } from "lib/types";

const items: SkillItem[] = [
  { ability: "KNO", label: "Arcana", modifier: 4, isProficient: true },
  { ability: "STR", label: "Blade", modifier: 3, isProficient: true },
  { ability: "INS", label: "Bone", modifier: 1 },
  { ability: "KNO", label: "Codex", modifier: 5, isExpert: true },
  { ability: "AGI", label: "Grace", modifier: 3, isProficient: true },
  { ability: "FIN", label: "Midnight", modifier: 4, isHalfProficient: true },
  { ability: "PRE", label: "Sage", modifier: 2 },
  { ability: "PRE", label: "Splendor", modifier: 3, isProficient: true },
  { ability: "STR", label: "Valor", modifier: 2 },
];
</script>

<template>
  <div class="dnd-ui-demo">
    <SkillCards :items="items" />
  </div>
</template>
