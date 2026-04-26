<script setup lang="ts">
import type { SkillItem, SkillRealmConfig } from "../types";
import { effectiveSkillRank } from "../skillCardRank";
import { computed } from "vue";

const props = defineProps<{
  items: SkillItem[];
  realms?: SkillRealmConfig[];
}>();

type RealmKey = "physical" | "cognitive" | "spiritual";
type RealmGroup = { key: string; label: string; items: SkillItem[] };

const labelToRealm: Record<string, RealmKey> = {
  agility: "physical",
  athletics: "physical",
  "heavy weaponry": "physical",
  "light weaponry": "physical",
  stealth: "physical",
  thievery: "physical",

  crafting: "cognitive",
  deduction: "cognitive",
  discipline: "cognitive",
  intimidation: "cognitive",
  lore: "cognitive",
  medicine: "cognitive",

  deception: "spiritual",
  insight: "spiritual",
  leadership: "spiritual",
  perception: "spiritual",
  persuasion: "spiritual",
  survival: "spiritual",
};

function realmFromAbility(ability: string): RealmKey {
  const key = String(ability).trim().toUpperCase();
  if (key === "STR" || key === "SPD") return "physical";
  if (key === "INT" || key === "WIL") return "cognitive";
  return "spiritual";
}

function realmForItem(item: SkillItem): RealmKey {
  const normalized = String(item.label || "").trim().toLowerCase();
  return labelToRealm[normalized] || realmFromAbility(item.ability);
}

const groupedRealms = computed<RealmGroup[]>(() => {
  if (Array.isArray(props.realms) && props.realms.length > 0) {
    const configured = props.realms.map((r) => ({
      id: String(r.id).trim().toLowerCase(),
      label: (r.label || r.id || "").toString(),
      skills: Array.isArray(r.skills)
        ? r.skills.map((x) => String(x).trim().toLowerCase()).filter(Boolean)
        : [],
    }));

    const byId: Record<string, SkillItem[]> = {};
    for (const r of configured) {
      byId[r.id] = [];
    }

    const normalizedToRealm = new Map<string, string>();
    for (const r of configured) {
      for (const s of r.skills) {
        if (!normalizedToRealm.has(s)) {
          normalizedToRealm.set(s, r.id);
        }
      }
    }

    for (const item of props.items) {
      const explicit = item.realm ? String(item.realm).trim().toLowerCase() : "";
      const normalized = String(item.label || "").trim().toLowerCase();
      const matchedRealmId = explicit || normalizedToRealm.get(normalized) || configured[0].id;
      if (!byId[matchedRealmId]) {
        byId[matchedRealmId] = [];
      }
      byId[matchedRealmId].push(item);
    }

    return configured.map((r) => ({
      key: r.id,
      label: r.label,
      items: byId[r.id] || [],
    }));
  }

  const groups: Record<RealmKey, SkillItem[]> = {
    physical: [],
    cognitive: [],
    spiritual: [],
  };

  for (const item of props.items) {
    groups[realmForItem(item)].push(item);
  }

  return [
    { key: "physical", label: "Physical", items: groups.physical },
    { key: "cognitive", label: "Cognitive", items: groups.cognitive },
    { key: "spiritual", label: "Spiritual", items: groups.spiritual },
  ];
});

function rankForItem(item: SkillItem): number {
  return effectiveSkillRank(item);
}
</script>

<template>
  <div class="dnd-ui-skills-grid">
    <div class="dnd-ui-skills-realms-grid">
      <section
        v-for="realm in groupedRealms"
        :key="realm.key"
        class="dnd-ui-skill-realm"
      >
        <div v-for="(item, index) in realm.items" :key="`${realm.key}-${index}-${item.label}`" class="dnd-ui-skill-card">
          <p class="dnd-ui-skill-left">
            <span class="dnd-ui-skill-modifier">{{ item.modifier }}</span>
            <span class="dnd-ui-skill-name">{{ item.label }}</span>
            <span class="dnd-ui-skill-ability">({{ item.ability }})</span>
          </p>
          <div class="dnd-ui-skill-rank-dots" :aria-label="`Rank ${rankForItem(item)} of 5`">
            <span
              v-for="i in 5"
              :key="i"
              :class="['dnd-ui-skill-dot', { 'dnd-ui-skill-dot-filled': i <= rankForItem(item) }]"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
