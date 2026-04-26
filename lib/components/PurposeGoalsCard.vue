<script setup lang="ts">
import type { PurposeGoalsBlock } from "../types";

type PurposeGoalsState = {
  goals: number[];
};

const props = defineProps<{
  static: PurposeGoalsBlock;
  state: PurposeGoalsState;
}>();

const emit = defineEmits<{
  "update:state": [newState: PurposeGoalsState];
}>();

const MAX_GOAL_DOTS = 3;

function goalValue(index: number): number {
  const raw = props.state.goals[index];
  if (typeof raw !== "number" || Number.isNaN(raw)) {
    return 0;
  }
  return Math.max(0, Math.min(MAX_GOAL_DOTS, raw));
}

function setGoalValue(index: number, nextValue: number) {
  const next = [...props.state.goals];
  next[index] = Math.max(0, Math.min(MAX_GOAL_DOTS, nextValue));
  emit("update:state", { goals: next });
}

function increaseGoal(index: number) {
  setGoalValue(index, goalValue(index) + 1);
}

function decreaseGoal(index: number) {
  setGoalValue(index, goalValue(index) - 1);
}
</script>

<template>
  <div class="dnd-ui-purpose-goals">
    <section class="dnd-ui-purpose-goals-section">
      <div class="dnd-ui-generic-card-label">Purpose</div>
      <div class="dnd-ui-purpose-goals-text">{{ props.static.purpose || "-" }}</div>
    </section>

    <section class="dnd-ui-purpose-goals-section">
      <div class="dnd-ui-generic-card-label">Obstacle</div>
      <div class="dnd-ui-purpose-goals-text">{{ props.static.obstacle || "-" }}</div>
    </section>

    <section class="dnd-ui-purpose-goals-section">
      <div class="dnd-ui-generic-card-label">Goals</div>
      <div v-if="(props.static.goals || []).length === 0" class="dnd-ui-purpose-goals-empty">-</div>
      <div v-else class="dnd-ui-purpose-goals-list">
        <div
          v-for="(goal, index) in props.static.goals"
          :key="`${goal}-${index}`"
          class="dnd-ui-purpose-goals-row"
        >
          <div class="dnd-ui-purpose-goals-goal">{{ goal }}</div>
          <div class="dnd-ui-purpose-goals-controls">
            <div class="dnd-ui-purpose-goals-dots" :aria-label="`Progress for ${goal}`">
              <span
                v-for="dot in MAX_GOAL_DOTS"
                :key="dot"
                :class="[
                  'dnd-ui-purpose-goals-dot',
                  { 'dnd-ui-purpose-goals-dot-filled': dot <= goalValue(index) },
                ]"
              />
            </div>
            <button
              type="button"
              class="dnd-ui-purpose-goals-btn"
              :aria-label="`Increase ${goal}`"
              @click="increaseGoal(index)"
            >
              Increase
            </button>
            <button
              type="button"
              class="dnd-ui-purpose-goals-btn"
              :aria-label="`Decrease ${goal}`"
              @click="decreaseGoal(index)"
            >
              Decrease
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
