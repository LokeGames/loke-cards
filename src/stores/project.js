import { defineStore } from 'pinia';
import { projectStore as lfProjects, saveProject, getProject, getCurrentProject } from '../lib/storage.js';

const KEY = 'LC_PROJECT_ID';

async function listProjects() {
  const items = [];
  await lfProjects.iterate((value, key) => {
    if (value && value.id) items.push(value);
  });
  // Ensure default exists
  if (!items.find(p => p.id === 'default')) {
    const def = { id: 'default', name: 'Default Project', createdAt: Date.now(), updatedAt: Date.now() };
    await saveProject(def);
    items.push(def);
  }
  // sort by createdAt/name
  items.sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)));
  return items;
}

async function migrateStampProjectIdOnLocal() {
  // Stamp scenes and chapters with projectId if missing
  const stamp = async (store) => {
    const toWrite = [];
    await store.iterate((value, key) => {
      if (value && !value.projectId) {
        value.projectId = 'default';
        toWrite.push({ key, value });
      }
    });
    for (const { key, value } of toWrite) {
      await store.setItem(key, value);
    }
  };
  try {
    const { sceneStore, chapterStore } = await import('../lib/storage.js');
    await stamp(sceneStore);
    await stamp(chapterStore);
  } catch {}
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
  }),
  actions: {
    async init() {
      this.loading = true;
      try {
        await migrateStampProjectIdOnLocal();
        this.projects = await listProjects();
        const savedId = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
        let current = this.projects.find(p => p.id === savedId);
        if (!current) {
          try {
            const def = await getCurrentProject();
            current = def || this.projects[0];
          } catch {
            current = this.projects[0];
          }
        }
        this.currentProject = current;
        try { localStorage.setItem(KEY, current.id); } catch {}
      } finally {
        this.loading = false;
      }
    },
    async selectProject(id) {
      const p = this.projects.find(pr => pr.id === id);
      if (!p) return false;
      this.currentProject = p;
      try { localStorage.setItem(KEY, p.id); } catch {}
      return true;
    },
    async createProject(nameOrId) {
      const id = String(nameOrId).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '') || 'project';
      const proj = { id, name: nameOrId, createdAt: Date.now(), updatedAt: Date.now() };
      await saveProject(proj);
      this.projects = await listProjects();
      return proj;
    },
    async renameProject(id, newName) {
      const p = this.projects.find(pr => pr.id === id);
      if (!p) return false;
      const upd = { ...p, name: newName, updatedAt: Date.now() };
      await saveProject(upd);
      this.projects = await listProjects();
      if (this.currentProject?.id === id) this.currentProject = upd;
      return true;
    },
    async deleteProject(id) {
      if (id === 'default') return false;
      // Soft delete: just remove from list; data cleanup left for later
      await lfProjects.removeItem(id);
      this.projects = await listProjects();
      if (!this.projects.find(p => p.id === this.currentProject?.id)) {
        this.currentProject = this.projects[0];
        try { localStorage.setItem(KEY, this.currentProject.id); } catch {}
      }
      return true;
    },
  },
});

