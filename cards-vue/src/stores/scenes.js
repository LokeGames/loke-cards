import { defineStore } from 'pinia';
import api from '../api/client.js';
import { normalizeScene, normalizeScenes } from '../lib/normalize.js';
import { getDb } from '../lib/db/index.js';
import { useProjectStore } from './project.js';

export const useSceneStore = defineStore('scenes', {
  state: () => ({
    scenes: [],
    loading: false,
    initialized: false,
  }),
  getters: {
    byId: (s) => (id) => s.scenes.find(x => x.sceneId === id),
  },
  actions: {
    projectId() {
      try { const ps = useProjectStore(); return ps.currentProject?.id || 'default'; } catch { return 'default'; }
    },
    scope(arr) {
      const pid = this.projectId();
      return (arr || []).filter(s => (s.projectId || 'default') === pid);
    },
    async loadLocal() {
      const db = await getDb();
      const local = await db.scenesList();
      this.scenes = this.scope(normalizeScenes(local));
    },
    async loadServer() {
      const data = await api.scenes.getAll();
      if (Array.isArray(data) && data.length > 0) this.scenes = this.scope(data);
    },
    async init() {
      if (this.initialized) return;
      this.loading = true;
      try {
        await this.loadLocal();
        try { await this.loadServer(); } catch {}
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },
    async refresh() {
      await this.loadLocal();
    },
    async upsert(sceneData) {
      const payload = { ...sceneData };
      if (!payload.projectId) payload.projectId = this.projectId();
      try {
        // If editing existing
        if (payload.sceneId) {
          try { await api.scenes.update(payload.sceneId, payload); }
          catch { await api.scenes.create(payload); }
        } else if (payload.id) {
          try { await api.scenes.update(payload.id, payload); }
          catch { await api.scenes.create(payload); }
        }
      } catch (_) {
        const local = {
          id: payload.sceneId || payload.id,
          sceneId: payload.sceneId || payload.id,
          chapter: payload.chapterId || payload.chapter,
          sceneText: payload.sceneText || '',
          choices: Array.isArray(payload.choices) ? payload.choices : [],
          stateChanges: Array.isArray(payload.stateChanges) ? payload.stateChanges : [],
          projectId: payload.projectId,
          updatedAt: Date.now(),
          createdAt: Date.now(),
          synced: false,
        };
        const db = await getDb();
        await db.scenesPut(local);
      }
      // Update local state
      const normalized = normalizeScene(payload);
      const idx = this.scenes.findIndex(s => s.sceneId === normalized.sceneId);
      if (idx >= 0) this.scenes[idx] = { ...this.scenes[idx], ...normalized };
      else this.scenes.push(normalized);
    },
    async remove(id) {
      try { await api.scenes.delete(id); } catch {}
      try { const db = await getDb(); await db.scenesDelete(id); } catch {}
      this.scenes = this.scenes.filter(s => s.sceneId !== id);
    },
    setProject(id) {
      // Consumers should call init/refresh after project change
      this.initialized = false;
    },
  },
});
