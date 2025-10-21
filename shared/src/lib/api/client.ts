// Simple API client with offline toggle. Intended for browser use.
import type { Scene, Chapter, Project } from '../storage';

let FORCE_OFFLINE = false;
export function setForceOffline(v: boolean) { FORCE_OFFLINE = v; }
export function isForcedOffline() { return FORCE_OFFLINE; }

function base(): string {
  // Default to /api so Vite dev proxy can be used
  const u = (import.meta as any)?.env?.VITE_API_BASE_URL || '/api';
  return String(u).replace(/\/$/, '');
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (FORCE_OFFLINE) throw new Error('Forced offline');
  const res = await fetch(base() + path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

// Scenes
export const scenes = {
  async list(projectId?: string): Promise<Scene[]> {
    const q = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return await fetchJson<Scene[]>(`/scenes${q}`);
  },
  async get(id: string): Promise<Scene> { return await fetchJson<Scene>(`/scenes/${encodeURIComponent(id)}`); },
  async upsert(scene: Scene): Promise<Scene> {
    return await fetchJson<Scene>(`/scenes/${encodeURIComponent(scene.id)}`, {
      method: 'PUT',
      body: JSON.stringify(scene),
    });
  },
  async create(scene: Scene): Promise<Scene> {
    return await fetchJson<Scene>(`/scenes`, { method: 'POST', body: JSON.stringify(scene) });
  },
  async remove(id: string): Promise<void> { await fetchJson(`/scenes/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
};

// Chapters
export const chapters = {
  async list(projectId?: string): Promise<Chapter[]> {
    const q = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return await fetchJson<Chapter[]>(`/chapters${q}`);
  },
  async get(id: string): Promise<Chapter> { return await fetchJson<Chapter>(`/chapters/${encodeURIComponent(id)}`); },
  async upsert(chapter: Chapter): Promise<Chapter> {
    return await fetchJson<Chapter>(`/chapters/${encodeURIComponent(chapter.id)}`, {
      method: 'PUT', body: JSON.stringify(chapter),
    });
  },
  async create(chapter: Chapter): Promise<Chapter> {
    return await fetchJson<Chapter>(`/chapters`, { method: 'POST', body: JSON.stringify(chapter) });
  },
  async remove(id: string): Promise<void> { await fetchJson(`/chapters/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
};

// Projects (minimal)
export const projectsApi = {
  async current(): Promise<Project> { return await fetchJson<Project>(`/projects/current`); },
};

