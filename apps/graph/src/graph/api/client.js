const ENV_BASE = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_ABSOLUTE = 'http://127.0.0.1:3000/api';
const API_BASE_URL = ENV_BASE || '/api';
const ABSOLUTE_BASE_URL = (ENV_BASE && /^https?:/i.test(ENV_BASE)) ? ENV_BASE : DEFAULT_ABSOLUTE;

let backendHealthy = null; let lastHealthCheck = 0; const HEALTH_TTL_MS = 4000;
function withTimeout(promise, ms = 800) { const ctl = new AbortController(); const t = setTimeout(() => ctl.abort('timeout'), ms); return Promise.race([ promise(ctl.signal).finally(() => clearTimeout(t)) ]).catch(() => { throw new Error('BACKEND_OFFLINE'); }); }
async function ensureBackend() { const now = Date.now(); if (backendHealthy !== null && now - lastHealthCheck < HEALTH_TTL_MS) return backendHealthy; try { await withTimeout((signal) => fetch(`${ABSOLUTE_BASE_URL}/health`, { signal })); backendHealthy = true; } catch { backendHealthy = false; } finally { lastHealthCheck = now; } return backendHealthy; }

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = { headers: { 'Content-Type': 'application/json' } };
  const config = { ...defaultOptions, ...options };
  try {
    if (API_BASE_URL.startsWith('/') && (await ensureBackend()) === false) { throw new Error('BACKEND_OFFLINE'); }
    const response = await fetch(url, config);
    if (!response.ok) { const errorData = await response.json().catch(() => ({})); throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`); }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return await response.json();
    return await response.text();
  } catch (error) { console.error(`API Error [${endpoint}]:`, error); throw error; }
}

export const scenesAPI = { async getAll() { return apiFetch('/scenes'); }, async getById(id) { return apiFetch(`/scenes/${id}`); }, async create(sceneData) { return apiFetch('/scenes', { method: 'POST', body: JSON.stringify(sceneData) }); }, async update(id, sceneData) { return apiFetch(`/scenes/${id}`, { method: 'PUT', body: JSON.stringify(sceneData) }); }, async delete(id) { return apiFetch(`/scenes/${id}`, { method: 'DELETE' }); } };
export const chaptersAPI = { async getAll() { return apiFetch('/chapters'); }, async getById(id) { return apiFetch(`/chapters/${id}`); }, async create(chapterData) { return apiFetch('/chapters', { method: 'POST', body: JSON.stringify(chapterData) }); }, async update(id, chapterData) { return apiFetch(`/chapters/${id}`, { method: 'PUT', body: JSON.stringify(chapterData) }); }, async delete(id) { return apiFetch(`/chapters/${id}`, { method: 'DELETE' }); } };
export const projectsAPI = { async getAll() { return apiFetch('/projects'); }, async getCurrent() { return apiFetch('/projects/current'); }, async getById(id) { return apiFetch(`/projects/${id}`); }, async create(projectData) { return apiFetch('/projects', { method: 'POST', body: JSON.stringify(projectData) }); }, async update(id, projectData) { return apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) }); }, async delete(id) { return apiFetch(`/projects/${id}`, { method: 'DELETE' }); } };

export async function healthCheck() { return await ensureBackend(); }

export default { scenes: scenesAPI, chapters: chaptersAPI, projects: projectsAPI, healthCheck, build: { async run() { return apiFetch('/build', { method: 'POST' }); }, async artifacts() { return apiFetch('/build/artifacts'); } }, codegen: { async sceneCode(id) { return fetch(`${API_BASE_URL}/scenes/${id}/code`).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); }); } } };

