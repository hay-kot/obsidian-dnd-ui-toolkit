export function readPathValue(source: unknown, path: string): unknown {
  if (!path || !path.trim()) return undefined;
  const parts = path
    .split(".")
    .map((p) => p.trim())
    .filter(Boolean);
  let cur: unknown = source;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

