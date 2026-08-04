// src/events/EventBus.ts

type EventCallback<T = any> = (payload?: T) => void;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on<T = any>(event: string, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);
  }

  off<T = any>(event: string, callback: EventCallback<T>) {
    this.listeners.get(event)?.delete(callback);

    if (this.listeners.get(event)?.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<T = any>(event: string, payload?: T) {
    this.listeners.get(event)?.forEach(callback => callback(payload));
  }

  clear(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export default new EventBus();
