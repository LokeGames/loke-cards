import { defineStore } from 'pinia';

let nextId = 1;

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] }),
  actions: {
    push({ type = 'info', message, timeout = 3000 } = {}) {
      const id = nextId++;
      const item = { id, type, message, timeout };
      this.items.push(item);
      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout);
      }
      return id;
    },
    remove(id) {
      this.items = this.items.filter((t) => t.id !== id);
    },
    clear() {
      this.items = [];
    },
    success(message, timeout = 2500) {
      return this.push({ type: 'success', message, timeout });
    },
    error(message, timeout = 4000) {
      return this.push({ type: 'error', message, timeout });
    },
    info(message, timeout = 3000) {
      return this.push({ type: 'info', message, timeout });
    },
  },
});

