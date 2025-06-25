import { Frontmatter } from "lib/types";

export interface ResetEvent {
  filePath: string; // Source file path for scoping
  eventType: string; // e.g., 'short-rest', 'long-rest', 'custom'
  amount?: number; // Optional amount to reset, if undefined resets to 0 (full reset)
}

type Topics = {
  reset: ResetEvent;
  "fm:changed": Frontmatter;
  "abilities:changed": void; // Triggered when abilities are recalculated
};

type Callbacks<T extends keyof Topics> = (data: Topics[T]) => void;

class EventBus<T extends keyof Topics> {
  private subscribers: { [scopedKey: string]: Callbacks<any>[] } = {};

  keybuilder<K extends T>(filepath: string, topic: K): string {
    // Remove leading slashes and normalize path separators
    filepath = filepath.replace(/^\/+/, "").replace(/\\/g, "/");
    return filepath + ":" + topic;
  }

  subscribe<K extends T>(scope: string, topic: K, callback: Callbacks<K>): () => void {
    const scopedKey = this.keybuilder(scope, topic);
    if (!this.subscribers[scopedKey]) {
      this.subscribers[scopedKey] = [];
    }
    this.subscribers[scopedKey].push(callback);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(scope, topic, callback);
    };
  }

  unsubscribe<K extends T>(scope: string, topic: K, callback: Callbacks<K>): void {
    const scopedKey = this.keybuilder(scope, topic);
    const callbacks = this.subscribers[scopedKey];
    if (callbacks) {
      this.subscribers[scopedKey] = callbacks.filter((cb) => cb !== callback);
      // Clean up empty arrays to prevent memory leaks
      if (this.subscribers[scopedKey].length === 0) {
        delete this.subscribers[scopedKey];
      }
    }
  }

  publish<K extends T>(scope: string, topic: K, payload: Topics[K]): void {
    const scopedKey = this.keybuilder(scope, topic);
    console.debug(`Publishing event: ${scopedKey}`, payload);
    const callbacks: Callbacks<K>[] | undefined = this.subscribers[scopedKey];
    console.debug("Subscribers for scope", scopedKey, callbacks);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(payload);
      }
    }
  }

  // Helper method to get all subscribers for debugging
  getSubscribers(): { [scopedKey: string]: number } {
    const result: { [scopedKey: string]: number } = {};
    for (const [key, callbacks] of Object.entries(this.subscribers)) {
      result[key] = callbacks.length;
    }
    return result;
  }

  // Helper method to clear all subscribers for a specific scope
  clearScope(scope: string): void {
    const normalizedScope = scope.replace(/^\/+/, "").replace(/\\/g, "/");
    const keysToDelete = Object.keys(this.subscribers).filter((key) => key.startsWith(normalizedScope + ":"));
    for (const key of keysToDelete) {
      delete this.subscribers[key];
    }
  }
}

// Define topics and their corresponding payload types
export const msgbus = new EventBus<keyof Topics>();
