import { describe, it, expect, beforeEach, vi } from "vitest";
import { JsonDataStore } from "./local-file-store";

// Mock Obsidian Vault
const createMockVault = () => {
  const files = new Map<string, string>();

  return {
    adapter: {
      exists: vi.fn(async (path: string) => files.has(path)),
      read: vi.fn(async (path: string) => {
        if (!files.has(path)) {
          throw new Error(`File not found: ${path}`);
        }
        return files.get(path) || "";
      }),
      write: vi.fn(async (path: string, content: string) => {
        files.set(path, content);
      }),
    },
    // Helper for testing
    _files: files,
  };
};

describe("JsonDataStore", () => {
  let mockVault: ReturnType<typeof createMockVault>;
  let dataStore: JsonDataStore;
  const testFilePath = "test-data.json";

  beforeEach(() => {
    mockVault = createMockVault();
    dataStore = new JsonDataStore(mockVault as any, testFilePath);
  });

  describe("loadData", () => {
    it("should create empty file and return empty object when file doesn't exist", async () => {
      const result = await dataStore.loadData();

      expect(result).toEqual({});
      expect(mockVault.adapter.exists).toHaveBeenCalledWith(testFilePath);
      expect(mockVault.adapter.write).toHaveBeenCalledWith(testFilePath, JSON.stringify({}, null, 2));
    });

    it("should load and parse existing JSON file", async () => {
      const testData = { key: "value", number: 42 };
      mockVault._files.set(testFilePath, JSON.stringify(testData));

      const result = await dataStore.loadData();

      expect(result).toEqual(testData);
      expect(mockVault.adapter.exists).toHaveBeenCalledWith(testFilePath);
      expect(mockVault.adapter.read).toHaveBeenCalledWith(testFilePath);
    });

    it("should return empty object when JSON parsing fails", async () => {
      mockVault._files.set(testFilePath, "invalid json");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await dataStore.loadData();

      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith("Error loading data:", expect.any(Error));

      consoleSpy.mockRestore();
    });

    it("should handle file read errors gracefully", async () => {
      mockVault.adapter.read.mockRejectedValue(new Error("Read error"));
      mockVault._files.set(testFilePath, "test");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await dataStore.loadData();

      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith("Error loading data:", expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe("saveData", () => {
    it("should save data as formatted JSON", async () => {
      const testData = { name: "test", value: 123, nested: { prop: true } };

      await dataStore.saveData(testData);

      expect(mockVault.adapter.write).toHaveBeenCalledWith(testFilePath, JSON.stringify(testData, null, 2));
    });

    it("should handle null and undefined values", async () => {
      const testData = { nullValue: null, undefinedValue: undefined };

      await dataStore.saveData(testData);

      expect(mockVault.adapter.write).toHaveBeenCalledWith(testFilePath, JSON.stringify(testData, null, 2));
    });

    it("should throw error when write fails", async () => {
      const writeError = new Error("Write failed");
      mockVault.adapter.write.mockRejectedValue(writeError);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(dataStore.saveData({})).rejects.toThrow("Write failed");
      expect(consoleSpy).toHaveBeenCalledWith("Error saving data:", writeError);

      consoleSpy.mockRestore();
    });
  });

  describe("integration", () => {
    it("should persist data across load/save cycles", async () => {
      const originalData = {
        settings: { theme: "dark" },
        counters: { visits: 5 },
        items: ["item1", "item2"],
      };

      // Save data
      await dataStore.saveData(originalData);

      // Create new store instance to simulate reload
      const newDataStore = new JsonDataStore(mockVault as any, testFilePath);
      const loadedData = await newDataStore.loadData();

      expect(loadedData).toEqual(originalData);
    });

    it("should handle empty data gracefully", async () => {
      await dataStore.saveData({});
      const loadedData = await dataStore.loadData();

      expect(loadedData).toEqual({});
    });

    it("should handle complex nested data structures", async () => {
      const complexData = {
        users: [
          { id: 1, name: "Alice", preferences: { theme: "light" } },
          { id: 2, name: "Bob", preferences: { theme: "dark" } },
        ],
        metadata: {
          version: "1.0.0",
          lastUpdate: "2023-01-01",
          features: {
            enabled: ["feature1", "feature2"],
            disabled: [],
          },
        },
      };

      await dataStore.saveData(complexData);
      const loadedData = await dataStore.loadData();

      expect(loadedData).toEqual(complexData);
    });
  });
});
