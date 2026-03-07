<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { classDefinitions } from "./classData";
import { generateCharacterSheet } from "./generators";
import type { CharacterData } from "./types";
import MarkdownPreview from "./MarkdownPreview.vue";

const name = ref("");
const selectedClass = ref("");
const abilities = ref({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
});
const selectedSkills = ref<string[]>([]);

const classNames = Object.keys(classDefinitions).sort();

const classDef = computed(() => {
  return selectedClass.value ? classDefinitions[selectedClass.value] : undefined;
});

watch(selectedClass, () => {
  selectedSkills.value = [];
  if (classDef.value) {
    abilities.value = { ...classDef.value.optimizedAbilities };
  }
});

const atSkillLimit = computed(() => {
  if (!classDef.value) return false;
  return selectedSkills.value.length >= classDef.value.skillChoices;
});

function toggleSkill(skill: string) {
  const idx = selectedSkills.value.indexOf(skill);
  if (idx >= 0) {
    selectedSkills.value.splice(idx, 1);
  } else if (!atSkillLimit.value) {
    selectedSkills.value.push(skill);
  }
}

const missingFields = computed(() => {
  const missing: string[] = [];
  if (!name.value.trim()) missing.push("character name");
  if (!selectedClass.value) missing.push("class");
  if (classDef.value && selectedSkills.value.length < classDef.value.skillChoices) {
    missing.push(`${classDef.value.skillChoices - selectedSkills.value.length} more skill(s)`);
  }
  return missing;
});

const canGenerate = computed(() => missingFields.value.length === 0);

const generatedMarkdown = computed(() => {
  if (!canGenerate.value || !classDef.value) return "";

  const data: CharacterData = {
    name: name.value.trim(),
    className: selectedClass.value,
    level: 1,
    proficiencyBonus: 2,
    abilities: { ...abilities.value },
    skillProficiencies: [...selectedSkills.value],
    savingThrows: [...classDef.value.savingThrows],
    hitDice: classDef.value.hitDice,
    baseHP: classDef.value.baseHP,
    spellcastingAbility: classDef.value.spellcastingAbility,
    spellSlots: classDef.value.spellSlots,
    classConsumables: classDef.value.classConsumables,
  };

  return generateCharacterSheet(data, classDef.value);
});

const abilityLabels: { key: keyof typeof abilities.value; label: string }[] = [
  { key: "strength", label: "Strength" },
  { key: "dexterity", label: "Dexterity" },
  { key: "constitution", label: "Constitution" },
  { key: "intelligence", label: "Intelligence" },
  { key: "wisdom", label: "Wisdom" },
  { key: "charisma", label: "Charisma" },
];
</script>

<template>
  <div class="character-generator">
    <!-- Character Info -->
    <section class="gen-section">
      <h3>Character Info</h3>
      <div class="form-row">
        <label class="form-label">
          Name
          <input v-model="name" type="text" placeholder="Enter character name" class="form-input" />
        </label>
        <label class="form-label">
          Class
          <select v-model="selectedClass" class="form-input">
            <option value="" disabled>Select a class</option>
            <option v-for="cn in classNames" :key="cn" :value="cn">
              {{ cn }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <!-- Ability Scores -->
    <section class="gen-section">
      <h3>Ability Scores</h3>
      <p class="section-note">
        Scores are pre-filled with the standard array (15, 14, 13, 12, 10, 8) optimized for the selected class. You can
        change them to whatever you'd like.
      </p>
      <div class="ability-grid">
        <label v-for="ab in abilityLabels" :key="ab.key" class="form-label ability-label">
          {{ ab.label }}
          <input v-model.number="abilities[ab.key]" type="number" min="1" max="30" class="form-input ability-input" />
        </label>
      </div>
    </section>

    <!-- Skill Proficiencies -->
    <section v-if="classDef" class="gen-section">
      <h3>
        Skill Proficiencies
        <span class="skill-count">{{ selectedSkills.length }} of {{ classDef.skillChoices }} selected</span>
      </h3>
      <div class="skill-grid">
        <label
          v-for="skill in classDef.availableSkills"
          :key="skill"
          class="skill-label"
          :class="{
            disabled: !selectedSkills.includes(skill) && atSkillLimit,
          }"
        >
          <input
            type="checkbox"
            :checked="selectedSkills.includes(skill)"
            :disabled="!selectedSkills.includes(skill) && atSkillLimit"
            @change="toggleSkill(skill)"
          />
          {{ skill }}
        </label>
      </div>
    </section>

    <!-- Output -->
    <section class="gen-section">
      <h3>Generated Markdown</h3>
      <div v-if="!canGenerate" class="gen-message">Please provide: {{ missingFields.join(", ") }}</div>
      <MarkdownPreview v-else :markdown="generatedMarkdown" :character-name="name" />
    </section>
  </div>
</template>

<style scoped>
.character-generator {
  max-width: 640px;
}

.gen-section {
  margin-bottom: 1.5rem;
}

.gen-section h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.section-note {
  margin: -0.25rem 0 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.form-input {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.ability-input {
  text-align: center;
}

.skill-count {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-left: 0.5rem;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
}

.skill-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.skill-label.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gen-message {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
