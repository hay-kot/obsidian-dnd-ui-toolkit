/**
 * Strips Obsidian callout markers (>) from text while preserving content.
 * Handles nested callouts (multiple > characters).
 *
 * @param text - The text that may contain callout markers
 * @returns The cleaned text with callout markers removed
 */
export function stripCalloutMarkers(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match lines starting with one or more > characters, optionally followed by a space
    const match = line.match(/^(>+)\s?(.*)/);
    result.push(match ? match[2] : line);
  }

  return result.join("\n");
}
