<script setup lang="ts">
import { ref, computed } from "vue";
import type { ParsedHealthBlock } from "lib/types";
import { HealthState, isSingleHitDiceState, isMultiHitDiceState, hasSingleHitDice } from "lib/domains/healthpoints";
import Checkbox from "lib/components/Checkbox.vue";

const props = defineProps<{
  static: ParsedHealthBlock;
  state: HealthState;
}>();

const emit = defineEmits<{
  "update:state": [newState: HealthState];
}>();

const inputValue = ref("1");

const maxHealth = computed(() => (typeof props.static.health === "number" ? props.static.health : 6));

const hitDiceLabelWidth = computed(() => {
  if (!props.static.hitdice || props.static.hitdice.length <= 1) return undefined;
  const longest = props.static.hitdice.reduce((max, hd) => Math.max(max, `HIT DICE (${hd.dice})`.length), 0);
  return `${longest * 0.6}em`;
});

const healthPercentage = computed(() => Math.max(0, Math.min(100, (props.state.current / maxHealth.value) * 100)));

function handleHeal() {
  const value = parseInt(inputValue.value) || 0;
  if (value <= 0) return;

  const newCurrent = Math.min(props.state.current + value, maxHealth.value);
  const newState: HealthState = {
    ...props.state,
    current: newCurrent,
  };

  if (newCurrent > 0 && props.state.current <= 0) {
    newState.deathSaveSuccesses = 0;
    newState.deathSaveFailures = 0;
  }

  emit("update:state", newState);
  inputValue.value = "1";
}

function handleDamage() {
  const value = parseInt(inputValue.value) || 0;
  if (value <= 0) return;

  let newTemp = props.state.temporary;
  let newCurrent = props.state.current;

  if (newTemp > 0) {
    if (value <= newTemp) {
      newTemp -= value;
    } else {
      const remainingDamage = value - newTemp;
      newTemp = 0;
      newCurrent = Math.max(0, newCurrent - remainingDamage);
    }
  } else {
    newCurrent = Math.max(0, newCurrent - value);
  }

  emit("update:state", {
    ...props.state,
    current: newCurrent,
    temporary: newTemp,
  });
  inputValue.value = "1";
}

function handleTempHP() {
  const value = parseInt(inputValue.value) || 0;
  if (value <= 0) return;

  // D&D 5e: temp HP doesn't stack, keep whichever is higher
  const newTemp = Math.max(props.state.temporary, value);

  emit("update:state", {
    ...props.state,
    temporary: newTemp,
  });
  inputValue.value = "1";
}

function calculateNewUsedCount(currentUsed: number, index: number): number {
  const isUsed = index < currentUsed;
  if (isUsed) {
    return index;
  } else {
    return index + 1;
  }
}

function toggleHitDie(diceType: string | null, index: number) {
  if (!diceType && isSingleHitDiceState(props.state)) {
    const newHitDiceUsed = calculateNewUsedCount(props.state.hitdiceUsed, index);
    emit("update:state", {
      ...props.state,
      hitdiceUsed: newHitDiceUsed,
    });
  } else if (diceType && isMultiHitDiceState(props.state)) {
    const currentUsed = props.state.hitdiceUsed[diceType] || 0;
    const newUsed = calculateNewUsedCount(currentUsed, index);
    emit("update:state", {
      ...props.state,
      hitdiceUsed: {
        ...(props.state.hitdiceUsed as Record<string, number>),
        [diceType]: newUsed,
      },
    });
  }
}

function toggleDeathSave(type: "success" | "failure", index: number) {
  const newState = { ...props.state };

  if (type === "success") {
    const isChecked = index < props.state.deathSaveSuccesses;
    newState.deathSaveSuccesses = isChecked ? index : index + 1;
  } else {
    const isChecked = index < props.state.deathSaveFailures;
    newState.deathSaveFailures = isChecked ? index : index + 1;
  }

  emit("update:state", newState);
}

function getHitDiceUsed(hd: { dice: string; value: number }): number {
  if (hasSingleHitDice(props.static) && isSingleHitDiceState(props.state)) {
    return props.state.hitdiceUsed;
  } else if (isMultiHitDiceState(props.state)) {
    return props.state.hitdiceUsed[hd.dice] || 0;
  }
  return 0;
}
</script>

<template>
  <div class="dnd-ui-health-card dnd-ui-generic-card">
    <div class="dnd-ui-health-card-header">
      <div class="dnd-ui-generic-card-label">{{ props.static.label || "Hit Points" }}</div>
      <div class="dnd-ui-health-value">
        {{ props.state.current }}
        <span class="dnd-ui-health-max">/ {{ maxHealth }}</span>
        <span v-if="props.state.temporary > 0" class="dnd-ui-health-temp">+{{ props.state.temporary }} temp</span>
      </div>
    </div>

    <div class="dnd-ui-health-progress-container">
      <div class="dnd-ui-health-progress-bar" :style="{ width: `${healthPercentage}%` }" />
    </div>

    <div class="dnd-ui-health-controls">
      <input
        type="number"
        class="dnd-ui-health-input"
        :value="inputValue"
        placeholder="0"
        aria-label="Health points"
        @input="inputValue = ($event.target as HTMLInputElement).value"
      />
      <button type="button" class="dnd-ui-health-button dnd-ui-health-heal" @click="handleHeal">Heal</button>
      <button type="button" class="dnd-ui-health-button dnd-ui-health-damage" @click="handleDamage">Damage</button>
      <button type="button" class="dnd-ui-health-button dnd-ui-health-temp" @click="handleTempHP">Temp HP</button>
    </div>

    <template v-if="props.static.hitdice && props.static.hitdice.length > 0">
      <div class="dnd-ui-health-divider" />
      <div
        class="dnd-ui-hit-dice-container"
        :style="hitDiceLabelWidth ? { '--hit-dice-label-width': hitDiceLabelWidth } : undefined"
      >
        <div class="dnd-ui-hit-dice-list">
          <div v-for="hd in props.static.hitdice" :key="hd.dice" class="dnd-ui-hit-dice-row">
            <p class="dnd-ui-hit-dice-label">HIT DICE ({{ hd.dice }})</p>
            <div class="dnd-ui-hit-dice-boxes">
              <Checkbox
                v-for="i in hd.value"
                :key="`${hd.dice}-${i - 1}`"
                :checked="i - 1 < getHitDiceUsed(hd)"
                :id="`hit-dice-${hd.dice}-${i - 1}`"
                @toggle="toggleHitDie(hasSingleHitDice(props.static) ? null : hd.dice, i - 1)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="props.static.death_saves && (props.static.death_saves === 'always' || props.state.current <= 0)">
      <div class="dnd-ui-health-divider" />
      <div class="dnd-ui-death-saves-container">
        <div class="dnd-ui-death-saves-tracker">
          <div class="dnd-ui-death-saves-failures">
            <Checkbox
              v-for="i in 3"
              :key="`failure-${i - 1}`"
              :checked="i - 1 < props.state.deathSaveFailures"
              :id="`death-save-failure-${i - 1}`"
              class-name="dnd-ui-death-save-failure"
              @toggle="toggleDeathSave('failure', i - 1)"
            />
          </div>
          <div class="dnd-ui-death-saves-skull">&#x1F480;</div>
          <div class="dnd-ui-death-saves-successes">
            <Checkbox
              v-for="i in 3"
              :key="`success-${i - 1}`"
              :checked="i - 1 < props.state.deathSaveSuccesses"
              :id="`death-save-success-${i - 1}`"
              class-name="dnd-ui-death-save-success"
              @toggle="toggleDeathSave('success', i - 1)"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
