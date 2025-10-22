import { defineStore } from 'pinia';
import api from '@cards/api/client.js'
import {
  getAllChapters as getAllChaptersLocal,
  getAllScenes as getAllScenesLocal,
  getScene as getSceneLocal,
  saveScene as saveSceneLocal,
  saveChapter as saveChapterLocal,
} from '@shared/lib/storage.js'
import { normalizeChapter, normalizeChapters, normalizeScene as normalizeSceneShape, normalizeScenes } from '@cards/lib/normalize.js'

// Use shared normalizers from lib/normalize.js

export const useGraphStore = defineStore('graph', {
  state: () => ({
    chapters: [], // normalized
    scenes: [], // normalized
    loading: false,
  }),
  actions: {
    async loadGlobal() {
      this.loading = true;
      try {
        // Offline-first: load local first
        let chapters = [];
        let scenes = [];
        try { chapters = await getAllChaptersLocal(); } catch (_) {}
        try { scenes = await getAllScenesLocal(); } catch (_) {}

        // Then try API (best effort)
        try { const c = await api.chapters.getAll(); if (Array.isArray(c) && c.length) chapters = c; } catch (_) {}
        try { const s = await api.scenes.getAll(); if (Array.isArray(s) && s.length) scenes = s; } catch (_) {}

        this.chapters = normalizeChapters(chapters).map((c) => ({
          id: c.id,
          title: c.name || c.title || c.id,
          position: c.position || undefined,
        }));
        this.scenes = normalizeScenes(scenes).map((s) => ({
          id: s.sceneId,
          chapterId: s.chapterId || '',
          title: s.title || s.sceneId,
          sceneText: s.sceneText || '',
          choices: Array.isArray(s.choices) ? s.choices : [],
          position: s.position || undefined,
        }));
      } finally {
        this.loading = false;
      }
    },
    async loadChapter(chapterId) {
      this.loading = true;
      try {
        await this.loadGlobal();
        // Filter to the specified chapter in views; keep all in state for edges
        // Consumers can filter by chapterId when building nodes.
        return true;
      } finally {
        this.loading = false;
      }
    },
    async persistScenePosition(sceneId, position) {
      const idx = this.scenes.findIndex((s) => s.id === sceneId);
      if (idx >= 0) {
        this.scenes[idx] = { ...this.scenes[idx], position };
        try {
          // Persist locally (always available)
          await saveSceneLocal({ id: sceneId, position, ...this.scenes[idx] });
        } catch (_) {}
        // Best-effort API update if available
        try {
          await api.scenes.update(sceneId, { position });
        } catch (_) {}
      }
    },
    async persistChapterPosition(chapterId, position) {
      const idx = this.chapters.findIndex((c) => c.id === chapterId);
      if (idx >= 0) {
        this.chapters[idx] = { ...this.chapters[idx], position };
        try { await saveChapterLocal({ id: chapterId, position, ...this.chapters[idx] }); } catch (_) {}
        try { await api.chapters.update(chapterId, { position }); } catch (_) {}
      }
    },
    async addChoiceLink(sourceSceneId, targetSceneId) {
      try {
        // Load full scene from local storage; fallback to normalized
        let scene = await getSceneLocal(sourceSceneId);
        if (!scene) {
          const s = this.scenes.find((x) => x.id === sourceSceneId);
          if (!s) return false;
          scene = {
            id: s.id,
            sceneId: s.id,
            chapter: s.chapterId,
            sceneText: s.sceneText || '',
            choices: Array.isArray(s.choices) ? [...s.choices] : [],
            stateChanges: [],
            updatedAt: Date.now(),
          };
        }
        if (!Array.isArray(scene.choices)) scene.choices = [];
        // avoid duplicates
        if (!scene.choices.some((c) => c && c.nextScene === targetSceneId)) {
          scene.choices.push({ text: 'Continue', nextScene: targetSceneId, enabled: true });
        }
        await saveSceneLocal(scene);
        // update local store normalized copy
        const idx = this.scenes.findIndex((x) => x.id === sourceSceneId);
        if (idx >= 0) {
          const normalized = normalizeSceneShape(scene);
          this.scenes[idx] = { ...this.scenes[idx], choices: normalized.choices };
        }
        // Best-effort API update (ignore if offline)
        try {
          await api.scenes.update(sourceSceneId, {
            sceneId: scene.sceneId,
            chapterId: scene.chapterId || scene.chapter,
            sceneText: scene.sceneText || '',
            choices: scene.choices || [],
            stateChanges: scene.stateChanges || [],
          });
        } catch (_) {}
        return true;
      } catch (_) {
        return false;
      }
    },
  },
});
