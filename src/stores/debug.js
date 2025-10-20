import { defineStore } from 'pinia';

export const useDebugStore = defineStore('debug', {
  state: () => ({
    entries: [], // { message, stack, time }
    visible: false,
  }),
  actions: {
    add(entry) {
      const e = {
        message: String(entry?.message || entry),
        stack: entry?.stack || '',
        time: new Date().toISOString(),
      };
      this.entries.unshift(e);
      // keep last 50
      if (this.entries.length > 50) this.entries.pop();
      this.visible = true;
    },
    clear() {
      this.entries = [];
    },
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
  },
});

