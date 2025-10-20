import { defineStore } from 'pinia';
import api from '../api/client.js';
import { normalizeChapters } from '../lib/normalize.js';
import { getDb } from '../lib/db/index.js';
import { useProjectStore } from './project.js';

export const useChapterStore = defineStore('chapters', {
  state: () => ({
    chapters: [],
    loading: false,
    initialized: false,
  }),
  getters: {
    byId: (s) => (id) => s.chapters.find(x => x.id === id),
  },
  actions: {
    projectId() {
      try { const ps = useProjectStore(); return ps.currentProject?.id || 'default'; } catch { return 'default'; }
    },
    scope(arr) {
      const pid = this.projectId();
      return (arr || []).filter(c => (c.projectId || 'default') === pid);
    },
    async loadLocal() {
      const db = await getDb();
      const local = await db.chaptersList();
      this.chapters = this.scope(local);
    },
    async loadServer() {
      const data = await api.chapters.getAll();
      if (Array.isArray(data) && data.length > 0) this.chapters = this.scope(data);
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
    async upsert(chapter) {
      const payload = { ...chapter };
      if (!payload.projectId) payload.projectId = this.projectId();
      try {
        if (payload.id) await api.chapters.update(payload.id, payload);
        else if (payload.chapterId) await api.chapters.update(payload.chapterId, { ...payload, id: payload.chapterId });
        else await api.chapters.create(payload);
      } catch (_) {
        const local = { id: payload.id || payload.chapterId, name: payload.name || payload.id, order: payload.order ?? Date.now(), projectId: payload.projectId };
        const db = await getDb();
        await db.chaptersPut(local);
      }
      const id = payload.id || payload.chapterId;
      const existing = this.chapters.findIndex(c => c.id === id);
      const normalized = { id, name: payload.name || id, projectId: payload.projectId, order: payload.order };
      if (existing >= 0) this.chapters[existing] = { ...this.chapters[existing], ...normalized };
      else this.chapters.push(normalized);
      // keep order stable
      this.chapters = this.chapters.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    async remove(id) {
      try { await api.chapters.delete(id); } catch {}
      try { const db = await getDb(); await db.chaptersDelete(id); } catch {}
      this.chapters = this.chapters.filter(c => c.id !== id);
    },
    setProject(id) {
      this.initialized = false;
    },
  },
});
