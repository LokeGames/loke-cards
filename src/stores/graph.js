import { defineStore } from 'pinia';
import api from '@/api/client.js';
import {
  getAllChapters as getAllChaptersLocal,
  getAllScenes as getAllScenesLocal,
  saveScene as saveSceneLocal,
  saveChapter as saveChapterLocal,
} from '@/lib/storage.js';

function normalizeChapter(ch) {
  return {
    id: ch.id || ch.chapterId || ch.name || 'chapter',
    title: ch.name || ch.title || ch.id || ch.chapterId || 'Chapter',
    position: ch.position || undefined,
  };
}

function normalizeScene(sc) {
  const id = sc.id || sc.sceneId;
  return {
    id,
    chapterId: sc.chapterId || sc.chapter || '',
    title: sc.sceneId || sc.title || id,
    sceneText: sc.sceneText || sc.text || '',
    choices: Array.isArray(sc.choices) ? sc.choices : [],
    position: sc.position || undefined,
  };
}

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
        // Try API, fallback to LocalForage
        let chapters = [];
        let scenes = [];
        try {
          chapters = await api.chapters.getAll();
        } catch (_) {
          chapters = await getAllChaptersLocal();
        }
        try {
          scenes = await api.scenes.getAll();
        } catch (_) {
          scenes = await getAllScenesLocal();
        }

        this.chapters = chapters.map(normalizeChapter);
        this.scenes = scenes.map(normalizeScene);
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
  },
});

