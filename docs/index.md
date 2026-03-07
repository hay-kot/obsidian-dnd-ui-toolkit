---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DnD UI Toolkit"
  text: "An Obsidian Plugin for TTRPGs"
  tagline: Build beautiful markdown-driven character sheets and game tools in Obsidian
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/quick-start
    - theme: alt
      text: View Components
      link: /components/ability-cards

features:
  - icon:
      src: /icons/dice-twenty-faces-twenty.svg
      alt: D20 die
    title: Ability Scores
    details: Interactive ability score cards with automatic modifier calculation and saving throw tracking.
    link: /character-sheet/ability-scores
  - icon:
      src: /icons/scroll-unfurled.svg
      alt: Unfurled scroll
    title: Skills
    details: Skill cards with proficiency tracking, ability-based modifiers, and compact multi-column layout.
    link: /character-sheet/skills
  - icon:
      src: /icons/heart-shield.svg
      alt: Heart with shield
    title: Health Tracking
    details: Full health management with HP, temporary HP, hit dice, and death saving throws.
    link: /character-sheet/healthpoints
  - icon:
      src: /icons/round-shield.svg
      alt: Round shield
    title: Stats & Badges
    details: Configurable stat badges for AC, level, race, initiative, and any custom values.
    link: /components/badges
  - icon:
      src: /icons/magic-swirl.svg
      alt: Magic swirl
    title: Spell Components
    details: Spell info panels showing DC, attack bonus, casting time, range, components, and duration.
    link: /character-sheet/spell-components
  - icon:
      src: /icons/health-potion.svg
      alt: Health potion
    title: Consumables
    details: Trackable resource slots for spell slots, potions, abilities, and other per-rest resources.
    link: /components/consumables
  - icon:
      src: /icons/crossed-swords.svg
      alt: Crossed swords
    title: Initiative Tracker
    details: Run combat encounters from your notes with turn order, HP tracking, and per-round resources.
    link: /dungeon-master/initiative-tracker
  - icon:
      src: /icons/linked-rings.svg
      alt: Linked rings
    title: Frontmatter Sync
    details: Automatically sync character data like proficiency bonus and level from note frontmatter.
    link: /character-sheet/frontmatter
---
