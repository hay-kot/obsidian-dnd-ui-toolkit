<script setup lang="ts">
import { computed } from "vue";
import type { CharacterSectionsBlock, WeaponSectionItem } from "../types";

const props = defineProps<{
  data: CharacterSectionsBlock;
}>();

function listItems(items: unknown): string[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function weaponItems(items: unknown): WeaponSectionItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const row = item as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      if (!name) {
        return null;
      }
      const dice = String(row.dice ?? "").trim();
      const damage = String(row.damage ?? "").trim();
      return { name, dice, damage };
    })
    .filter((item): item is WeaponSectionItem => item !== null);
}

const conditionsLabel = computed(() => props.data.conditions_injuries?.label || "Conditions & Injuries");
const expertisesLabel = computed(() => props.data.expertises?.label || "Expertises");
const weaponsLabel = computed(() => props.data.weapons?.label || "Weapons");
const talentsLabel = computed(() => props.data.talents?.label || "Talents");

const conditionsItems = computed(() => listItems(props.data.conditions_injuries?.items));
const expertiseItems = computed(() => listItems(props.data.expertises?.items));
const talentItems = computed(() => listItems(props.data.talents?.items));
const weaponsItems = computed(() => weaponItems(props.data.weapons?.items));
</script>

<template>
  <div class="dnd-ui-character-sections">
    <section class="dnd-ui-character-sections-card dnd-ui-character-sections-conditions">
      <div class="dnd-ui-generic-card-label">{{ conditionsLabel }}</div>
      <ul v-if="conditionsItems.length" class="dnd-ui-character-sections-list">
        <li v-for="(item, index) in conditionsItems" :key="`condition-${index}`">
          {{ item }}
        </li>
      </ul>
      <div v-else class="dnd-ui-character-sections-empty">-</div>
    </section>

    <section class="dnd-ui-character-sections-card dnd-ui-character-sections-expertises">
      <div class="dnd-ui-generic-card-label">{{ expertisesLabel }}</div>
      <ul v-if="expertiseItems.length" class="dnd-ui-character-sections-list">
        <li v-for="(item, index) in expertiseItems" :key="`expertise-${index}`">
          {{ item }}
        </li>
      </ul>
      <div v-else class="dnd-ui-character-sections-empty">-</div>
    </section>

    <section class="dnd-ui-character-sections-card dnd-ui-character-sections-weapons">
      <div class="dnd-ui-generic-card-label">{{ weaponsLabel }}</div>
      <ul v-if="weaponsItems.length" class="dnd-ui-character-sections-list">
        <li v-for="(weapon, index) in weaponsItems" :key="`weapon-${index}`">
          <span class="dnd-ui-character-sections-weapon-name">{{ weapon.name }}</span>
          <span v-if="weapon.dice || weapon.damage" class="dnd-ui-character-sections-weapon-meta">
            <span v-if="weapon.dice">{{ weapon.dice }}</span>
            <span v-if="weapon.dice && weapon.damage">, </span>
            <span v-if="weapon.damage">{{ weapon.damage }}</span>
          </span>
        </li>
      </ul>
      <div v-else class="dnd-ui-character-sections-empty">-</div>
    </section>

    <section class="dnd-ui-character-sections-card dnd-ui-character-sections-talents">
      <div class="dnd-ui-generic-card-label">{{ talentsLabel }}</div>
      <ul v-if="talentItems.length" class="dnd-ui-character-sections-list">
        <li v-for="(item, index) in talentItems" :key="`talent-${index}`">
          {{ item }}
        </li>
      </ul>
      <div v-else class="dnd-ui-character-sections-empty">-</div>
    </section>
  </div>
</template>
