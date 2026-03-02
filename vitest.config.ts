import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
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
    },
  },
});
