type EventListener<T = any> = (data: T) => void;

interface EventSubscription {
  eventType: string;
  filePath: string;
  listener: EventListener;
}

export interface ResetEvent {
  eventType: string; // e.g., 'short-rest', 'long-rest', 'custom'
  filePath: string; // Source file path for scoping
  timestamp: number; // When the event was triggered
}

/**
 * Global event bus for file-scoped events within the D&D UI Toolkit.
 * Events are scoped to the file where they originate, allowing components
 * within the same file to respond to reset events and other triggers.
 */
export class EventBus {
  private static instance: EventBus;
  private subscriptions: EventSubscription[] = [];

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to events of a specific type within a specific file scope
   */
  subscribe<T = any>(eventType: string, filePath: string, listener: EventListener<T>): () => void {
    const subscription: EventSubscription = {
      eventType,
      filePath: this.normalizeFilePath(filePath),
      listener,
    };

    this.subscriptions.push(subscription);

    // Return unsubscribe function
    return () => {
      const index = this.subscriptions.indexOf(subscription);
      if (index > -1) {
        this.subscriptions.splice(index, 1);
      }
    };
  }

  /**
   * Dispatch an event to all subscribers within the same file scope
   */
  dispatch<T = any>(eventType: string, filePath: string, data?: T): void {
    const normalizedPath = this.normalizeFilePath(filePath);

    const matchingSubscriptions = this.subscriptions.filter(
      (sub) => sub.eventType === eventType && sub.filePath === normalizedPath
    );

    console.debug(
      `EventBus: Dispatching ${eventType} to ${matchingSubscriptions.length} subscribers in ${normalizedPath}`
    );

    matchingSubscriptions.forEach((sub) => {
      try {
        sub.listener(data);
      } catch (error) {
        console.error(`EventBus: Error in event listener for ${eventType}:`, error);
      }
    });
  }

  /**
   * Dispatch a reset event - a common pattern for resetting component states
   */
  dispatchReset(eventType: string, filePath: string): void {
    const resetEvent: ResetEvent = {
      eventType,
      filePath: this.normalizeFilePath(filePath),
      timestamp: Date.now(),
    };

    this.dispatch("reset", filePath, resetEvent);
  }

  /**
   * Remove all subscriptions for a specific file (useful for cleanup)
   */
  unsubscribeAll(filePath: string): void {
    const normalizedPath = this.normalizeFilePath(filePath);
    this.subscriptions = this.subscriptions.filter((sub) => sub.filePath !== normalizedPath);
  }

  /**
   * Get the number of active subscriptions (for debugging)
   */
  getSubscriptionCount(): number {
    return this.subscriptions.length;
  }

  /**
   * Get subscriptions for a specific file (for debugging)
   */
  getFileSubscriptions(filePath: string): EventSubscription[] {
    const normalizedPath = this.normalizeFilePath(filePath);
    return this.subscriptions.filter((sub) => sub.filePath === normalizedPath);
  }

  /**
   * Normalize file paths to ensure consistent matching
   */
  private normalizeFilePath(filePath: string): string {
    // Remove leading slashes and normalize path separators
    return filePath.replace(/^\/+/, "").replace(/\\/g, "/");
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();
