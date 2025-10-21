import { defineStore } from 'pinia';
import { createGraphClient } from '@cards/lib/api/graphClient.js';

export const useGraphStore = defineStore('graph', {
  state: () => ({ chapters: [], scenes: [], loading: false, _client: null, _unsub: null }),
  actions: {
    ensureClient() { if (!this._client) this._client = createGraphClient(); return this._client; },
    async loadGlobal() {
      this.loading = true;
      try {
        const client = this.ensureClient();
        const { chapters, scenes } = await client.listAll();
        // Normalize to expected shapes for builders
        this.chapters = (chapters || []).map(c => ({ id: c.id, title: c.name || c.title || c.id, position: c.position || undefined }));
        this.scenes = (scenes || []).map(s => ({
          id: s.sceneId || s.id,
          sceneId: s.sceneId || s.id,
          chapterId: s.chapterId || s.chapter || '',
          title: s.title || s.sceneId || s.id,
          sceneText: s.sceneText || '',
          choices: Array.isArray(s.choices) ? s.choices : [],
          position: s.position || undefined,
        }));
        if (!this._unsub) {
          this._unsub = client.subscribe(async () => { await this.loadGlobal(); });
        }
      } finally { this.loading = false; }
    },
    async loadChapter() { await this.loadGlobal(); return true; },
    async persistScenePosition(sceneId, position) {
      const idx = this.scenes.findIndex((s) => s.id === sceneId);
      if (idx >= 0) {
        this.scenes[idx] = { ...this.scenes[idx], position };
        const client = this.ensureClient();
        const s = this.scenes[idx];
        try { await client.upsertScene({ sceneId: s.id, chapterId: s.chapterId, position: s.position, sceneText: s.sceneText, choices: s.choices }); } catch (error) { console.error(error); }
      }
    },
    async persistChapterPosition(chapterId, position) {
      const idx = this.chapters.findIndex((c) => c.id === chapterId);
      if (idx >= 0) {
        this.chapters[idx] = { ...this.chapters[idx], position };
        const client = this.ensureClient();
        const c = this.chapters[idx];
        try { await client.upsertChapter({ id: c.id, name: c.title, position: c.position }); } catch (error) { console.error(error); }
      }
    },
    async addChoiceLink(sourceSceneId, targetSceneId) {
      try {
        const idx = this.scenes.findIndex((x) => x.id === sourceSceneId);
        if (idx < 0) return false;
        const scene = { ...this.scenes[idx] };
        const choices = Array.isArray(scene.choices) ? [...scene.choices] : [];
        if (!choices.some((c) => c && c.nextScene === targetSceneId)) { choices.push({ text: 'Continue', nextScene: targetSceneId, enabled: true }); }
        scene.choices = choices;
        this.scenes[idx] = scene;
        const client = this.ensureClient();
        await client.upsertScene({ sceneId: scene.id, chapterId: scene.chapterId, sceneText: scene.sceneText, choices: scene.choices });
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
        try { const client = this.ensureClient(); await client.deleteScene(sceneId); } catch (error) { console.error(`Failed to delete scene ${sceneId}`, error); }
      }
    },
    async deleteChapter(chapterId) {
      const index = this.chapters.findIndex((c) => c.id === chapterId);
      if (index > -1) {
        this.chapters.splice(index, 1);
        try { const client = this.ensureClient(); await client.deleteChapter(chapterId); } catch (error) { console.error(`Failed to delete chapter ${chapterId}`, error); }
      }
    },
  },
});
