import { parse } from "yaml";

/**
 * Parses a code block body into a keyed object.
 *
 * The `yaml` package types `parse` as `any`, which silently spreads through
 * every block parser and defeats type checking on the shapes in lib/types.ts.
 * Routing all block parsing through here confines the cast to one place.
 *
 * Block bodies are user-authored and may be empty, a bare scalar, or a
 * sequence where a mapping is expected. Every caller merges the result over a
 * defaults object, so those cases collapse to `null` and let the defaults
 * stand rather than throwing. The returned properties are `Partial` because
 * nothing has validated them yet — only the merge guarantees a full shape.
 */
export function parseYamlObject<T>(yamlString: string): Partial<T> | null {
  const parsed: unknown = parse(yamlString);

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  return parsed as Partial<T>;
}
