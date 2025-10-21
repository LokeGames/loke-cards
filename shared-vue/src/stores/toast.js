import { defineStore } from 'pinia';

let nextId = 1;
const MAX_TOASTS = 5;

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] }),
  actions: {
    push(input = {}) {
      const { type = 'info', message = '', timeout } = input;
      const id = nextId++;
      const defaultTimeout = type === 'error' ? 4000 : type === 'success' ? 2500 : 3000;
      const item = { id, type, message, timeout: typeof timeout === 'number' ? timeout : defaultTimeout };
      // limit stack size
      if (this.items.length >= MAX_TOASTS) this.items.shift();
      this.items.push(item);
      if (item.timeout > 0) {
        setTimeout(() => this.remove(id), item.timeout);
      }
      return id;
    },
    remove(id) {
      this.items = this.items.filter((t) => t.id !== id);
    },
    clear() {
      this.items = [];
    },
    success(message, timeout) {
      return this.push({ type: 'success', message, timeout });
    },
    error(message, timeout) {
      return this.push({ type: 'error', message, timeout });
    },
    info(message, timeout) {
      return this.push({ type: 'info', message, timeout });
    },
  },
});
