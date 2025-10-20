import { defineStore } from 'pinia';
import api from '../api/client.js';
import {
  getAllChapters as getAllChaptersLocal,
  getAllScenes as getAllScenesLocal,
  getScene as getSceneLocal,
  saveScene as saveSceneLocal,
  saveChapter as saveChapterLocal,
} from '../lib/storage.js';

function normalizeChapter(ch) {
  let src = ch;
  if (ch && ch.data) {
    try {
      const parsed = typeof ch.data === 'string' ? JSON.parse(ch.data) : ch.data;
      src = { ...parsed, id: ch.id || parsed.id };
    } catch (_) {
      // keep original
    }
  }
  return {
    id: src.id || src.chapterId || src.name || 'chapter',
    title: src.name || src.title || src.id || src.chapterId || 'Chapter',
    position: src.position || undefined,
  };
}

function normalizeScene(sc) {
  let src = sc;
  if (sc && sc.data) {
    try {
      const parsed = typeof sc.data === 'string' ? JSON.parse(sc.data) : sc.data;
      src = { ...parsed, id: sc.id || parsed.id };
    } catch (_) {
      // keep original
    }
  }
  const id = src.id || src.sceneId;
  return {
    id,
    chapterId: src.chapterId || src.chapter || '',
    title: src.title || src.sceneId || id,
    sceneText: src.sceneText || src.text || '',
    choices: Array.isArray(src.choices) ? src.choices : [],
    position: src.position || undefined,
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
          // API failed – use local
          chapters = await getAllChaptersLocal();
        }
        try {
          scenes = await api.scenes.getAll();
        } catch (_) {
          // API failed – use local
          scenes = await getAllScenesLocal();
        }
        // If API returned empty arrays, fallback to local to ensure NodeView shows content offline
        if (!Array.isArray(chapters) || chapters.length === 0) {
          try { chapters = await getAllChaptersLocal(); } catch (_) {}
        }
        if (!Array.isArray(scenes) || scenes.length === 0) {
          try { scenes = await getAllScenesLocal(); } catch (_) {}
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
          const normalized = normalizeScene(scene);
          this.scenes[idx] = { ...this.scenes[idx], choices: normalized.choices };
        }
        // Best-effort API update (ignore if offline)
        try {
          await api.scenes.update(sourceSceneId, {
            sceneId: scene.sceneId || scene.id,
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
