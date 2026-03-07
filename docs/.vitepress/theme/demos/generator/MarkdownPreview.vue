<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  markdown: string;
  characterName: string;
}>();

const copied = ref(false);

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.markdown);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function download() {
  const filename =
    props.characterName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "character";
  const blob = new Blob([props.markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="markdown-preview">
    <div class="preview-actions">
      <button @click="copyToClipboard" class="preview-btn">
        {{ copied ? "Copied!" : "Copy" }}
      </button>
      <button @click="download" class="preview-btn">Download</button>
    </div>
    <pre class="preview-code"><code>{{ markdown }}</code></pre>
  </div>
</template>

<style scoped>
.markdown-preview {
  margin-top: 1rem;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.preview-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.85rem;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.preview-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.preview-code {
  background: var(--vp-code-bg);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
</style>
