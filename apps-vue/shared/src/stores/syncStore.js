import { defineStore } from 'pinia';

// Possible statuses: 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
export const useSyncStore = defineStore('sync', {
  state: () => ({
    status: 'synced',
    lastSync: null,
    pending: 0,
    error: null,
  }),
  getters: {
    isOnline: (s) => s.status !== 'offline',
  },
  actions: {
    setStatus(status) {
      this.status = status;
    },
    setPending(n) {
      this.pending = n;
    },
    setError(err) {
      this.error = err;
      this.status = 'error';
    },
    markSynced() {
      this.status = 'synced';
      this.lastSync = Date.now();
      this.error = null;
    },
    markOffline() {
      this.status = 'offline';
    },
    startSync() {
      this.status = 'syncing';
    },
  },
});

