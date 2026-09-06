/**
 * CORE - EventBus
 * Ultra-fast, lightweight pub/sub event bus for decoupled system communication.
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const list = this.listeners.get(event);
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(event, payload) {
    if (!this.listeners.has(event)) return;
    const list = this.listeners.get(event);
    for (let i = 0; i < list.length; i++) {
      try {
        list[i](payload);
      } catch (err) {
        console.error(`EventBus error on '${event}':`, err);
      }
    }
  }

  clear() {
    this.listeners.clear();
  }
}

window.eventBus = new EventBus();
