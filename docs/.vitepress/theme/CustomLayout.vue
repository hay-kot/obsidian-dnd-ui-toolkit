<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import D20Icon from "./D20Icon.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <D20Icon :size="320" />
    </template>
  </Layout>
</template>
