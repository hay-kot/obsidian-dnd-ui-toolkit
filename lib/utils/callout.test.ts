import { describe, it, expect } from "vitest";
import { stripCalloutMarkers } from "./callout";

describe("stripCalloutMarkers", () => {
  it("should return unchanged text when no callout markers present", () => {
    const text = "This is normal text\nwithout any callout markers";
    expect(stripCalloutMarkers(text)).toBe(text);
  });

  it("should strip single callout marker from beginning of lines", () => {
    const input = "> This is a callout\n> Another callout line";
    const expected = "This is a callout\nAnother callout line";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should strip nested callout markers", () => {
    const input = ">>> Deeply nested callout\n>> Less nested\n> Single level";
    const expected = "Deeply nested callout\nLess nested\nSingle level";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle callout markers without spaces", () => {
    const input = ">No space after marker\n> With space after marker";
    const expected = "No space after marker\nWith space after marker";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should preserve lines without callout markers in mixed content", () => {
    const input = "Normal line\n> Callout line\nAnother normal line\n>> Nested callout";
    const expected = "Normal line\nCallout line\nAnother normal line\nNested callout";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle empty lines", () => {
    const input = "> First line\n\n> Third line";
    const expected = "First line\n\nThird line";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle code blocks inside callouts", () => {
    const input = "> ```ability\n> ability:\n>   strength: 10\n> ```";
    const expected = "```ability\nability:\n  strength: 10\n```";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle multiple nested levels with code blocks", () => {
    const input = ">>> ```skills\n>>> proficiencies:\n>>>   - athletics\n>>> ```";
    const expected = "```skills\nproficiencies:\n  - athletics\n```";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle empty input", () => {
    expect(stripCalloutMarkers("")).toBe("");
  });

  it("should handle single line input", () => {
    expect(stripCalloutMarkers("> Single line")).toBe("Single line");
  });

  it("should preserve indentation after stripping callout markers", () => {
    const input = ">     Indented content\n>   Less indented";
    const expected = "    Indented content\n  Less indented";
    expect(stripCalloutMarkers(input)).toBe(expected);
  });

  it("should handle real-world ability block example", () => {
    const input = `> \`\`\`ability
> ability:
>   strength: 8
>   dexterity: 14
>   constitution: 12
>   intelligence: 10
>   wisdom: 13
>   charisma: 16
> bonuses:
>   - ability: charisma
>     value: 2
> \`\`\``;

    const expected = `\`\`\`ability
ability:
  strength: 8
  dexterity: 14
  constitution: 12
  intelligence: 10
  wisdom: 13
  charisma: 16
bonuses:
  - ability: charisma
    value: 2
\`\`\``;

    expect(stripCalloutMarkers(input)).toBe(expected);
  });
});
