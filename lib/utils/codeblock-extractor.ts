import { stripCalloutMarkers } from "./callout";

/**
 * Extracts code blocks of a specific type from text.
 * Handles callout markers automatically.
 *
 * @param text - The text to search for code blocks
 * @param blockType - The type of code block to extract (e.g., "ability", "skills")
 * @returns Array of code block contents (without the backticks and type)
 */
export function extractCodeBlocks(text: string, blockType: string): string[] {
  // Strip callout markers first
  const cleanedText = stripCalloutMarkers(text);

  // Create regex pattern for the specific code block type
  const pattern = new RegExp(`\\\`\\\`\\\`${blockType}[\\s\\S]*?\\\`\\\`\\\``, "g");
  const matches = cleanedText.match(pattern);

  if (!matches) {
    return [];
  }

  // Extract content from each match
  return matches.map((match) => {
    // Remove the backticks and block type
    return match.replace(new RegExp(`\\\`\\\`\\\`${blockType}|\\\`\\\`\\\``, "g"), "").trim();
  });
}

/**
 * Extracts the first code block of a specific type from text.
 *
 * @param text - The text to search for code blocks
 * @param blockType - The type of code block to extract
 * @returns The first code block content or null if none found
 */
export function extractFirstCodeBlock(text: string, blockType: string): string | null {
  const blocks = extractCodeBlocks(text, blockType);
  return blocks.length > 0 ? blocks[0] : null;
}
