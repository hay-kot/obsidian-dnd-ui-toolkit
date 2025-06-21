import { describe, it, expect, beforeEach } from "vitest";
import { DataStore, KeyValueStore } from "./kv";

class MockDataStore implements DataStore {
  private data: any = null;

  async loadData(): Promise<any> {
    return this.data;
  }

  async saveData(data: any): Promise<void> {
    this.data = data;
  }

  reset(): void {
    this.data = null;
  }
}

describe("KeyValueStore", () => {
  let mockStore: MockDataStore;
  let kvStore: KeyValueStore;

  beforeEach(() => {
    mockStore = new MockDataStore();
    kvStore = new KeyValueStore(mockStore);
  });

  describe("get", () => {
    it("should return undefined for non-existent key", async () => {
      const result = await kvStore.get("nonexistent");
      expect(result).toBeUndefined();
    });

    it("should return stored value for existing key", async () => {
      await kvStore.set("testKey", "testValue");
      const result = await kvStore.get("testKey");
      expect(result).toBe("testValue");
    });

    it("should return typed value", async () => {
      const testObject = { foo: "bar", num: 42 };
      await kvStore.set("objKey", testObject);
      const result = await kvStore.get<typeof testObject>("objKey");
      expect(result).toEqual(testObject);
    });
  });

  describe("set", () => {
    it("should store and persist value", async () => {
      await kvStore.set("key1", "value1");

      // Create new store instance with same data store to test persistence
      const newKvStore = new KeyValueStore(mockStore);
      const result = await newKvStore.get("key1");
      expect(result).toBe("value1");
    });

    it("should overwrite existing value", async () => {
      await kvStore.set("key1", "oldValue");
      await kvStore.set("key1", "newValue");
      const result = await kvStore.get("key1");
      expect(result).toBe("newValue");
    });
  });

  describe("has", () => {
    it("should return false for non-existent key", async () => {
      const result = await kvStore.has("nonexistent");
      expect(result).toBe(false);
    });

    it("should return true for existing key", async () => {
      await kvStore.set("existingKey", "value");
      const result = await kvStore.has("existingKey");
      expect(result).toBe(true);
    });
  });

  describe("delete", () => {
    it("should return false for non-existent key", async () => {
      const result = await kvStore.delete("nonexistent");
      expect(result).toBe(false);
    });

    it("should return true and remove existing key", async () => {
      await kvStore.set("keyToDelete", "value");
      const deleteResult = await kvStore.delete("keyToDelete");
      expect(deleteResult).toBe(true);

      const hasResult = await kvStore.has("keyToDelete");
      expect(hasResult).toBe(false);
    });

    it("should persist deletion", async () => {
      await kvStore.set("keyToDelete", "value");
      await kvStore.delete("keyToDelete");

      // Create new store instance to test persistence
      const newKvStore = new KeyValueStore(mockStore);
      const hasResult = await newKvStore.has("keyToDelete");
      expect(hasResult).toBe(false);
    });
  });

  describe("clear", () => {
    it("should remove all keys", async () => {
      await kvStore.set("key1", "value1");
      await kvStore.set("key2", "value2");

      await kvStore.clear();

      const has1 = await kvStore.has("key1");
      const has2 = await kvStore.has("key2");
      expect(has1).toBe(false);
      expect(has2).toBe(false);
    });

    it("should persist clear operation", async () => {
      await kvStore.set("key1", "value1");
      await kvStore.clear();

      // Create new store instance to test persistence
      const newKvStore = new KeyValueStore(mockStore);
      const keys = await newKvStore.keys();
      expect(keys).toEqual([]);
    });
  });

  describe("keys", () => {
    it("should return empty array for empty store", async () => {
      const keys = await kvStore.keys();
      expect(keys).toEqual([]);
    });

    it("should return all keys", async () => {
      await kvStore.set("key1", "value1");
      await kvStore.set("key2", "value2");
      await kvStore.set("key3", "value3");

      const keys = await kvStore.keys();
      expect(keys.sort()).toEqual(["key1", "key2", "key3"]);
    });
  });

  describe("values", () => {
    it("should return empty array for empty store", async () => {
      const values = await kvStore.values();
      expect(values).toEqual([]);
    });

    it("should return all values", async () => {
      await kvStore.set("key1", "value1");
      await kvStore.set("key2", "value2");
      await kvStore.set("key3", 42);

      const values = await kvStore.values();
      expect(values.sort()).toEqual([42, "value1", "value2"]);
    });
  });

  describe("entries", () => {
    it("should return empty array for empty store", async () => {
      const entries = await kvStore.entries();
      expect(entries).toEqual([]);
    });

    it("should return all key-value pairs", async () => {
      await kvStore.set("key1", "value1");
      await kvStore.set("key2", 42);

      const entries = await kvStore.entries();
      expect(entries.sort()).toEqual([
        ["key1", "value1"],
        ["key2", 42],
      ]);
    });
  });

  describe("cache behavior", () => {
    it("should initialize cache from existing data store", async () => {
      // Pre-populate the mock store
      await mockStore.saveData({ state: { preKey: "preValue" } });

      // Create new KV store instance
      const newKvStore = new KeyValueStore(mockStore);
      const result = await newKvStore.get("preKey");
      expect(result).toBe("preValue");
    });

    it("should handle null/undefined data from store", async () => {
      mockStore.reset();
      const result = await kvStore.get("anyKey");
      expect(result).toBeUndefined();
    });
  });
});
