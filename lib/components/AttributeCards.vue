<script setup lang="ts">
import type { AttributeCardCell, AttributeCardsBlock } from "../types";

const props = defineProps<{
  data: AttributeCardsBlock;
}>();

function displayValue(cell: AttributeCardCell): string {
  if (typeof cell.value === "number") {
    return String(cell.value);
  }
  return String(cell.value ?? "");
}

function headerLabel(cell: AttributeCardCell): string {
  return cell.label_short || cell.label;
}
</script>

<template>
  <div class="dnd-ui-attribute-cards">
    <h2 v-if="props.data.heading" class="dnd-ui-attribute-heading">{{ props.data.heading }}</h2>
    <div class="dnd-ui-attribute-realms-grid">
      <section
        v-for="(realm, rIndex) in props.data.realms"
        :key="rIndex"
        class="dnd-ui-attribute-realm"
      >
        <h3 class="dnd-ui-attribute-realm-title">{{ realm.label }}</h3>
        <div class="dnd-ui-attribute-realm-row" role="group" :aria-label="realm.label">
          <div class="dnd-ui-attribute-realm-side dnd-ui-attribute-realm-left">
            <div class="dnd-ui-ability-score-card dnd-ui-attribute-rect-card">
              <div class="dnd-ui-ability-header">
                <p class="dnd-ui-ability-name">{{ headerLabel(realm.primary) }}</p>
              </div>
              <p class="dnd-ui-ability-modifier dnd-ui-attribute-metric">{{ displayValue(realm.primary) }}</p>
              <div
                v-if="realm.primary.sublabel"
                class="dnd-ui-ability-modifier-saving dnd-ui-attribute-sublabel"
              >
                <em>{{ realm.primary.sublabel }}</em>
              </div>
            </div>
          </div>
          <div class="dnd-ui-attribute-realm-center">
            <div
              class="dnd-ui-attribute-shield"
              :aria-label="realm.defense.label"
            >
              <div class="dnd-ui-attribute-shield-clip dnd-ui-attribute-shield-frame">
                <div class="dnd-ui-ability-score-card dnd-ui-attribute-shield-card">
                  <div class="dnd-ui-ability-header dnd-ui-attribute-shield-header">
                    <p class="dnd-ui-ability-name">{{ headerLabel(realm.defense) }}</p>
                  </div>
                  <p class="dnd-ui-ability-modifier dnd-ui-attribute-metric dnd-ui-attribute-shield-metric">
                    {{ displayValue(realm.defense) }}
                  </p>
                  <div
                    v-if="realm.defense.sublabel"
                    class="dnd-ui-ability-modifier-saving dnd-ui-attribute-sublabel"
                  >
                    <em>{{ realm.defense.sublabel }}</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dnd-ui-attribute-realm-side dnd-ui-attribute-realm-right">
            <div class="dnd-ui-ability-score-card dnd-ui-attribute-rect-card">
              <div class="dnd-ui-ability-header">
                <p class="dnd-ui-ability-name">{{ headerLabel(realm.secondary) }}</p>
              </div>
              <p class="dnd-ui-ability-modifier dnd-ui-attribute-metric">{{ displayValue(realm.secondary) }}</p>
              <div
                v-if="realm.secondary.sublabel"
                class="dnd-ui-ability-modifier-saving dnd-ui-attribute-sublabel"
              >
                <em>{{ realm.secondary.sublabel }}</em>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="realm.resources.length"
          class="dnd-ui-attribute-resource-row"
          :aria-label="`${realm.label} resources`"
          :style="{ gridTemplateColumns: `repeat(${realm.resources.length}, minmax(0, 1fr))` }"
        >
          <div
            v-for="(res, i) in realm.resources"
            :key="i"
            class="dnd-ui-generic-card dnd-ui-attribute-resource-card"
          >
            <div class="dnd-ui-generic-card-label">{{ res.label }}</div>
            <div class="dnd-ui-generic-card-value dnd-ui-attribute-resource-value">
              {{ displayValue(res) }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
