/** Convert a character name to a safe state_key prefix: lowercase, spaces to underscores, strip non-alphanumeric */
export function sanitizeStateKey(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || "char"
  );
}
