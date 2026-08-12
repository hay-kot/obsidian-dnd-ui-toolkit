import { normalizePath, Vault } from "obsidian";
import { DataStore } from "./kv";

export class JsonDataStore implements DataStore {
  private filePath: string;
  private vault: Vault;

  /**
   * Creates a new JsonDataStore
   * @param vault Obsidian vault instance
   * @param filePath Path to the JSON file (relative to vault root)
   */
  constructor(vault: Vault, filePath: string) {
    this.vault = vault;
    this.filePath = normalizePath(filePath);
  }

  /**
   * Loads data from the JSON file, creating it if it doesn't exist.
   * Read and parse errors propagate to the caller so a transient failure
   * never gets persisted back as an empty state file.
   *
   * The adapter API is used instead of the Vault API because the default
   * state file path is a dotfile, which the vault index does not track.
   */
  async loadData(): Promise<unknown> {
    const exists = await this.vault.adapter.exists(this.filePath);

    if (!exists) {
      await this.vault.adapter.write(this.filePath, JSON.stringify({}, null, 2));
      return {};
    }

    const data = await this.vault.adapter.read(this.filePath);
    return JSON.parse(data);
  }

  /**
   * Saves data to the JSON file
   * @param data The data to save
   */
  async saveData(data: unknown): Promise<void> {
    await this.vault.adapter.write(this.filePath, JSON.stringify(data, null, 2));
  }
}
