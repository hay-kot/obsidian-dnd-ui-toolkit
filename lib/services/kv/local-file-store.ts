import { Vault } from "obsidian";

export interface DataStore {
  loadData(): Promise<any>;
  saveData(data: any): Promise<void>;
}

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
    this.filePath = filePath;
  }

  /**
   * Loads data from the JSON file
   * @returns Promise resolving to the parsed data
   */
  async loadData(): Promise<any> {
    try {
      // Check if the file exists
      const exists = await this.vault.adapter.exists(this.filePath);

      if (!exists) {
        await this.vault.adapter.write(this.filePath, JSON.stringify({}, null, 2));
        return {};
      }

      // Read the existing file
      const data = await this.vault.adapter.read(this.filePath);
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading data:", error);
      // Return empty object as fallback
      return {};
    }
  }

  /**
   * Saves data to the JSON file
   * @param data The data to save
   */
  async saveData(data: any): Promise<void> {
    try {
      // Write the data to the file
      await this.vault.adapter.write(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  }
}
