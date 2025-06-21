export interface DataStore {
  loadData(): Promise<any>;
  saveData(data: any): Promise<void>;
}

export class KeyValueStore {
  private store: DataStore;
  private cache: Record<string, any> | null = null;

  constructor(store: DataStore) {
    this.store = store;
  }

  /**
   * Initialize the cache from the data store
   */
  private async ensureCache(): Promise<void> {
    if (this.cache === null) {
      const data = await this.store.loadData();
      this.cache = data?.state || {};
    }
  }

  /**
   * Persist the current cache to the data store
   */
  private async persistCache(): Promise<void> {
    if (this.cache !== null) {
      await this.store.saveData({ state: this.cache });
    }
  }

  /**
   * Get a value by key with type safety
   * @param key The key to retrieve
   * @returns The value for the key, or undefined if not found
   */
  async get<T>(key: string): Promise<T | undefined> {
    await this.ensureCache();
    return this.cache![key] as T | undefined;
  }

  /**
   * Set a value by key
   * @param key The key to set
   * @param value The value to store
   */
  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureCache();
    this.cache![key] = value;
    await this.persistCache();
  }

  /**
   * Check if a key exists in the store
   * @param key The key to check
   * @returns True if the key exists, false otherwise
   */
  async has(key: string): Promise<boolean> {
    await this.ensureCache();
    return key in this.cache!;
  }

  /**
   * Delete a key from the store
   * @param key The key to delete
   * @returns True if the key was deleted, false if it didn't exist
   */
  async delete(key: string): Promise<boolean> {
    await this.ensureCache();
    if (key in this.cache!) {
      delete this.cache![key];
      await this.persistCache();
      return true;
    }
    return false;
  }

  /**
   * Clear all keys from the store
   */
  async clear(): Promise<void> {
    this.cache = {};
    await this.persistCache();
  }

  /**
   * Get all keys in the store
   * @returns Array of keys
   */
  async keys(): Promise<string[]> {
    await this.ensureCache();
    return Object.keys(this.cache!);
  }

  /**
   * Get all values in the store
   * @returns Array of values
   */
  async values<T>(): Promise<T[]> {
    await this.ensureCache();
    return Object.values(this.cache!) as T[];
  }

  /**
   * Get all entries in the store
   * @returns Array of [key, value] pairs
   */
  async entries<T>(): Promise<[string, T][]> {
    await this.ensureCache();
    return Object.entries(this.cache!) as [string, T][];
  }
}
