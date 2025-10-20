import { defineStore } from 'pinia';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal, getScene as getSceneLocal, saveScene as saveSceneLocal, saveChapter as saveChapterLocal } from '../lib/storage.js';

function normalizeChapter(ch) {
  let src = ch;
  if (ch && ch.data) {
    try { const parsed = typeof ch.data === 'string' ? JSON.parse(ch.data) : ch.data; src = { ...parsed, id: ch.id || parsed.id }; } catch (_) {}
  }
  return { id: src.id || src.chapterId || src.name || 'chapter', title: src.name || src.title || src.id || src.chapterId || 'Chapter', position: src.position || undefined };
}

function normalizeScene(sc) {
  let src = sc;
  if (sc && sc.data) {
    try { const parsed = typeof sc.data === 'string' ? JSON.parse(sc.data) : sc.data; src = { ...parsed, id: sc.id || parsed.id }; } catch (_) {}
  }
  const id = src.id || src.sceneId;
  return { id, chapterId: src.chapterId || src.chapter || '', title: src.title || src.sceneId || id, sceneText: src.sceneText || src.text || '', choices: Array.isArray(src.choices) ? src.choices : [], position: src.position || undefined };
}

export const useGraphStore = defineStore('graph', {
  state: () => ({ chapters: [], scenes: [], loading: false }),
  actions: {
    async loadGlobal() {
      this.loading = true;
      try {
        let chapters = [];
        let scenes = [];
        try { chapters = await api.chapters.getAll(); } catch (_) { chapters = await getAllChaptersLocal(); }
        try { scenes = await api.scenes.getAll(); } catch (_) { scenes = await getAllScenesLocal(); }
        if (!Array.isArray(chapters) || chapters.length === 0) { try { chapters = await getAllChaptersLocal(); } catch (_) {} }
        if (!Array.isArray(scenes) || scenes.length === 0) { try { scenes = await getAllScenesLocal(); } catch (_) {} }
        this.chapters = chapters.map(normalizeChapter);
        this.scenes = scenes.map(normalizeScene);
      } finally { this.loading = false; }
    },
    async loadChapter(id) { await this.loadGlobal(); return true; },
    async persistScenePosition(sceneId, position) {
      const idx = this.scenes.findIndex((s) => s.id === sceneId);
      if (idx >= 0) {
        this.scenes[idx] = { ...this.scenes[idx], position };
        try { await saveSceneLocal({ id: sceneId, position, ...this.scenes[idx] }); } catch (_) {}
        try { await api.scenes.update(sceneId, { position }); } catch (_) {}
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
        let scene = await getSceneLocal(sourceSceneId);
        if (!scene) {
          const s = this.scenes.find((x) => x.id === sourceSceneId);
          if (!s) return false;
          scene = { id: s.id, sceneId: s.id, chapter: s.chapterId, sceneText: s.sceneText || '', choices: Array.isArray(s.choices) ? [...s.choices] : [], stateChanges: [], updatedAt: Date.now() };
        }
        if (!Array.isArray(scene.choices)) scene.choices = [];
        if (!scene.choices.some((c) => c && c.nextScene === targetSceneId)) { scene.choices.push({ text: 'Continue', nextScene: targetSceneId, enabled: true }); }
        await saveSceneLocal(scene);
        const idx = this.scenes.findIndex((x) => x.id === sourceSceneId);
        if (idx >= 0) { const normalized = normalizeScene(scene); this.scenes[idx] = { ...this.scenes[idx], choices: normalized.choices }; }
        try { await api.scenes.update(sourceSceneId, { sceneId: scene.sceneId || scene.id, chapterId: scene.chapterId || scene.chapter, sceneText: scene.sceneText || '', choices: scene.choices || [], stateChanges: scene.stateChanges || [] }); } catch (_) {}
        return true;
      } catch (_) { return false; }
    },
  },
});

