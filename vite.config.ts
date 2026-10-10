import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { builtinModules } from "node:module";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "lib"),
      settings: path.resolve(__dirname, "settings.ts"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  build: {
    outDir: ".",
    lib: {
      entry: "main.ts",
      fileName: () => "main.js",
      formats: ["cjs"],
    },
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: mode !== "production" ? "inline" : false,
    minify: mode === "production",
    rollupOptions: {
      external: [
        "obsidian",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        // Both spellings: a bare `fs` and a prefixed `node:fs` are distinct
        // specifiers to rollup, and `builtin-modules` only listed the former.
        ...builtinModules,
        ...builtinModules.map((name) => `node:${name}`),
      ],
      output: {
        assetFileNames: (info) => (info.name?.endsWith(".css") ? "styles.css" : (info.name ?? "asset")),
      },
    },
  },
}));
