import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "settings";
import { LEGACY_STATE_PATH, readLegacySettings, resolveDefaultStatePath } from "./legacy";

const createAdapter = (files: Record<string, string>) => ({
  exists: vi.fn(async (path: string) => path in files),
  read: vi.fn(async (path: string) => files[path]),
});

describe("readLegacySettings", () => {
  const legacyPath = ".obsidian/plugins/dnd-ui-toolkit/data.json";

  it("returns the settings saved under the old plugin id", async () => {
    const adapter = createAdapter({ [legacyPath]: JSON.stringify({ statePath: "custom.json" }) });

    expect(await readLegacySettings(adapter, ".obsidian")).toEqual({ statePath: "custom.json" });
  });

  it("returns null when there are no legacy settings", async () => {
    expect(await readLegacySettings(createAdapter({}), ".obsidian")).toBeNull();
  });

  it("returns null when the legacy settings are not valid JSON", async () => {
    const adapter = createAdapter({ [legacyPath]: "{not json" });

    expect(await readLegacySettings(adapter, ".obsidian")).toBeNull();
  });
});

describe("resolveDefaultStatePath", () => {
  it("keeps the legacy state file when it exists", async () => {
    const adapter = createAdapter({ [LEGACY_STATE_PATH]: "{}" });

    expect(await resolveDefaultStatePath(adapter)).toBe(LEGACY_STATE_PATH);
  });

  it("uses the current default when no legacy state file exists", async () => {
    expect(await resolveDefaultStatePath(createAdapter({}))).toBe(DEFAULT_SETTINGS.statePath);
    expect(DEFAULT_SETTINGS.statePath).toBe(".ttrpg-ui-toolkit-state.json");
  });
});
