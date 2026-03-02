import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.config.*",
        "main.ts",
        "vite.config.ts",
        "version-bump.mjs",
      ],
    },
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "lib"),
      settings: path.resolve(__dirname, "settings.ts"),
      obsidian: path.resolve(__dirname, "__mocks__/obsidian.ts"),
    },
  },
});
