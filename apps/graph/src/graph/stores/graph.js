import { defineStore } from 'pinia';
import api from '@graph/api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal, getScene as getSceneLocal, saveScene as saveSceneLocal, saveChapter as saveChapterLocal, deleteScene as deleteSceneLocal, deleteChapter as deleteChapterLocal } from '@graph/lib/storage.js';
import { normalizeChapter as normalizeChapterShape, normalizeChapters, normalizeScene as normalizeSceneShape, normalizeScenes } from '@graph/lib/normalize.js';

// Use shared normalizers

export const useGraphStore = defineStore('graph', {
  state: () => ({ chapters: [], scenes: [], loading: false }),
  actions: {
    async loadGlobal() {
      this.loading = true;
      try {
        let chapters = [];
        let scenes = [];
        try { chapters = await api.chapters.getAll(); } catch (error) { console.error(error); chapters = await getAllChaptersLocal(); }
        try { scenes = await api.scenes.getAll(); } catch (error) { console.error(error); scenes = await getAllScenesLocal(); }
        if (!Array.isArray(chapters) || chapters.length === 0) { try { chapters = await getAllChaptersLocal(); } catch (error) { console.error(error); } }
        if (!Array.isArray(scenes) || scenes.length === 0) { try { scenes = await getAllScenesLocal(); } catch (error) { console.error(error); } }
        this.chapters = normalizeChapters(chapters).map((c) => ({
          id: c.id,
          title: c.name || c.title || c.id,
          position: c.position || undefined,
        }));
        this.scenes = normalizeScenes(scenes).map((s) => ({
          id: s.sceneId, // internal id is canonical sceneId
          sceneId: s.sceneId,
          chapterId: s.chapterId || '',
          title: s.title || s.sceneId,
          sceneText: s.sceneText || '',
          choices: Array.isArray(s.choices) ? s.choices : [],
          position: s.position || undefined,
        }));
      } finally { this.loading = false; }
    },
    async loadChapter() { await this.loadGlobal(); return true; },
    async persistScenePosition(sceneId, position) {
      const idx = this.scenes.findIndex((s) => s.id === sceneId);
      if (idx >= 0) {
        this.scenes[idx] = { ...this.scenes[idx], position };
        try { await saveSceneLocal({ id: sceneId, position, ...this.scenes[idx] }); } catch (error) { console.error(error); }
        try { await api.scenes.update(sceneId, { position }); } catch (error) { console.error(error); }
      }
    },
    async persistChapterPosition(chapterId, position) {
      const idx = this.chapters.findIndex((c) => c.id === chapterId);
      if (idx >= 0) {
        this.chapters[idx] = { ...this.chapters[idx], position };
        try { await saveChapterLocal({ id: chapterId, position, ...this.chapters[idx] }); } catch (error) { console.error(error); }
        try { await api.chapters.update(chapterId, { position }); } catch (error) { console.error(error); }
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
        if (idx >= 0) { const normalized = normalizeSceneShape(scene); this.scenes[idx] = { ...this.scenes[idx], choices: normalized.choices }; }
        try { await api.scenes.update(sourceSceneId, { sceneId: scene.sceneId, chapterId: scene.chapterId || scene.chapter, sceneText: scene.sceneText || '', choices: scene.choices || [], stateChanges: scene.stateChanges || [] }); } catch (error) { console.error(error); }
        return true;
      } catch (error) { console.error(error); return false; }
    },
    async deleteNode({ id, type }) {
      if (type === 'scene') {
        await this.deleteScene(id.replace('scene-', ''));
      } else if (type === 'chapter') {
        await this.deleteChapter(id.replace('chap-', ''));
      }
    },
    async deleteScene(sceneId) {
      const index = this.scenes.findIndex((s) => s.id === sceneId);
      if (index > -1) {
        this.scenes.splice(index, 1);
        try {
          await api.scenes.delete(sceneId);
          await deleteSceneLocal(sceneId);
        } catch (error) {
          console.error(`Failed to delete scene ${sceneId}`, error);
        }
      }
    },
    async deleteChapter(chapterId) {
      const index = this.chapters.findIndex((c) => c.id === chapterId);
      if (index > -1) {
        this.chapters.splice(index, 1);
        try {
          await api.chapters.delete(chapterId);
          await deleteChapterLocal(chapterId);
        } catch (error) {
          console.error(`Failed to delete chapter ${chapterId}`, error);
        }
      }
    },
    async deleteEdge({ source, target }) {
      const sourceId = source.replace('scene-', '');
      const targetId = target.replace('scene-', '');

      const sceneIndex = this.scenes.findIndex((s) => s.id === sourceId);
      if (sceneIndex > -1) {
        const scene = this.scenes[sceneIndex];
        const choiceIndex = scene.choices.findIndex((c) => c.nextScene === targetId);
        if (choiceIndex > -1) {
          scene.choices.splice(choiceIndex, 1);
          try {
            await saveSceneLocal(scene);
            await api.scenes.update(sourceId, scene);
          } catch (error) {
            console.error(`Failed to delete edge from ${sourceId} to ${targetId}`, error);
          }
        }
      }
    },
  },
});
