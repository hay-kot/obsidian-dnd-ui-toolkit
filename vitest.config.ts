import { defineConfig } from "vitest/config";

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
    },
  },
});
