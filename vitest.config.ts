import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.config.*",
        "main.ts",
        "esbuild.config.mjs",
        "version-bump.mjs",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/lib",
      "@lib": "/lib",
      obsidian: path.resolve(__dirname, "./test-utils/mock-obsidian.ts"),
    },
  },
});
