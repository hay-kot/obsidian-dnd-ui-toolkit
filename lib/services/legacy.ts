import { DataAdapter, normalizePath } from "obsidian";
import { DEFAULT_SETTINGS, TtrpgUIToolkitSettings } from "settings";

// The plugin shipped as "dnd-ui-toolkit" before its id changed. Obsidian keys a
// plugin's data.json by id, so users upgrading would otherwise start with
// default settings and a fresh state file.
export const LEGACY_PLUGIN_ID = "dnd-ui-toolkit";
export const LEGACY_STATE_PATH = ".dnd-ui-toolkit-state.json";

type Adapter = Pick<DataAdapter, "exists" | "read">;

/**
 * Reads the settings the plugin saved under its old id, or null when there are
 * none or they cannot be parsed.
 */
export async function readLegacySettings(
  adapter: Adapter,
  configDir: string
): Promise<Partial<TtrpgUIToolkitSettings> | null> {
  const path = normalizePath(`${configDir}/plugins/${LEGACY_PLUGIN_ID}/data.json`);
  if (!(await adapter.exists(path))) return null;

  try {
    return JSON.parse(await adapter.read(path)) as Partial<TtrpgUIToolkitSettings>;
  } catch {
    return null;
  }
}

/**
 * The state file to use when the user never chose one: an existing legacy file
 * wins so upgrades keep their state, otherwise the current default.
 */
export async function resolveDefaultStatePath(adapter: Adapter): Promise<string> {
  return (await adapter.exists(LEGACY_STATE_PATH)) ? LEGACY_STATE_PATH : DEFAULT_SETTINGS.statePath;
}
