/**
 * API Client for loke-cards backend
 *
 * Communicates with the C++ backend server (port 3000)
 * Handles all HTTP requests for scenes, chapters, and projects
 *
 * @typedef {import('../types/domain').Scene} Scene
 * @typedef {import('../types/domain').Chapter} Chapter
 */

// Base URLs
// Prefer absolute URL from env to bypass Vite proxy logs when backend is offline.
const ENV_BASE = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_ABSOLUTE = 'http://127.0.0.1:3000/api';
const API_BASE_URL = ENV_BASE || '/api';
const ABSOLUTE_BASE_URL = (ENV_BASE && /^https?:/i.test(ENV_BASE)) ? ENV_BASE : DEFAULT_ABSOLUTE;

let backendHealthy = null; // null = unknown, true/false known
let lastHealthCheck = 0;
const HEALTH_TTL_MS = 2000;

// Manual override to simulate offline (Phase 7 testing)
let FORCE_OFFLINE = false;
export function setForceOffline(v) {
  FORCE_OFFLINE = !!v;
}

// Force a real-time health probe (ignores TTL cache)
export async function forceHealthCheck() {
  if (FORCE_OFFLINE) {
    backendHealthy = false;
    lastHealthCheck = Date.now();
    return false;
  }
  try {
    await withTimeout((signal) => fetch(`${ABSOLUTE_BASE_URL}/health`, { signal }), 900);
    backendHealthy = true;
  } catch (_) {
    backendHealthy = false;
  } finally {
    lastHealthCheck = Date.now();
  }
  return backendHealthy;
}

function withTimeout(promise, ms = 800) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort('timeout'), ms);
  return Promise.race([
    promise(ctl.signal).finally(() => clearTimeout(t)),
  ]).catch(() => { throw new Error('BACKEND_OFFLINE'); });
}

async function ensureBackend() {
  if (FORCE_OFFLINE) {
    backendHealthy = false;
    lastHealthCheck = Date.now();
    return false;
  }
  const now = Date.now();
  if (backendHealthy !== null && now - lastHealthCheck < HEALTH_TTL_MS) return backendHealthy;
  try {
    await withTimeout((signal) => fetch(`${ABSOLUTE_BASE_URL}/health`, { signal }));
    backendHealthy = true;
  } catch (_) {
    backendHealthy = false;
  } finally {
    lastHealthCheck = now;
  }
  return backendHealthy;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    // Respect forced offline
    if (FORCE_OFFLINE) {
      throw new Error('BACKEND_OFFLINE');
    }
    // If using proxied relative '/api' and backend is known offline, short‑circuit to avoid Vite proxy errors
    if (API_BASE_URL.startsWith('/') && (await ensureBackend()) === false) {
      throw new Error('BACKEND_OFFLINE');
    }
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

async function apiFetchAbs(endpoint, options = {}) {
  if (FORCE_OFFLINE) {
    throw new Error('BACKEND_OFFLINE');
  }
  const url = `${ABSOLUTE_BASE_URL}${endpoint}`;
  const defaultOptions = { headers: { 'Content-Type': 'application/json' } };
  const config = { ...defaultOptions, ...options };
  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return await response.json();
  return await response.text();
}

import { normalizeScene, normalizeScenes, normalizeChapters } from '../lib/normalize.js';

/**
 * Scene API endpoints
 */
export const scenesAPI = {
  /**
   * Get all scenes
   */
  /**
   * @returns {Promise<Scene[]>}
   */
  async getAll() {
    // Prefer proxy when healthy; if empty array returned, fallback to absolute
    if (API_BASE_URL.startsWith('/')) {
      const healthy = await ensureBackend();
      if (healthy) {
        try {
          const res = await apiFetch('/scenes');
          if (Array.isArray(res) && res.length > 0) return normalizeScenes(res);
          // fallback to absolute if proxy yields empty
          const abs = await apiFetchAbs('/scenes');
          return normalizeScenes(abs);
        } catch (_) {
          // fallback absolute
          const abs = await apiFetchAbs('/scenes');
          return normalizeScenes(abs);
        }
      }
      // unhealthy: short circuit (will be caught by callers)
    }
    // Absolute by default
    const abs = await apiFetchAbs('/scenes');
    return normalizeScenes(abs);
  },

  /**
   * Get a single scene by ID
   */
  /**
   * @param {string} id
   * @returns {Promise<Scene>}
   */
  async getById(id) {
    const res = await apiFetch(`/scenes/${id}`);
    return normalizeScene(res);
  },

  /**
   * Create a new scene
   * @param {Object} sceneData - Scene data object
   * @param {string} sceneData.sceneId - Scene function name
   * @param {string} sceneData.chapterId - Chapter ID
   * @param {string} sceneData.sceneText - Scene description
   * @param {Array} sceneData.choices - Array of choice objects
   * @param {Array} sceneData.stateChanges - Array of state change objects
   */
  /**
   * @param {Partial<Scene>} sceneData
   * @returns {Promise<Scene>}
   */
  async create(sceneData) {
    const payload = {
      ...sceneData,
      id: sceneData.sceneId || sceneData.id,
      chapter: sceneData.chapterId || sceneData.chapter,
    };
    return apiFetch('/scenes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing scene
   */
  /**
   * @param {string} id
   * @param {Partial<Scene>} sceneData
   * @returns {Promise<Scene>}
   */
  async update(id, sceneData) {
    const payload = {
      ...sceneData,
      id: sceneData.sceneId || sceneData.id,
      chapter: sceneData.chapterId || sceneData.chapter,
    };
    return apiFetch(`/scenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a scene
   */
  /**
   * @param {string} id
   * @returns {Promise<{ ok: boolean }|any>}
   */
  async delete(id) {
    return apiFetch(`/scenes/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Chapter API endpoints
 */
export const chaptersAPI = {
  /**
   * Get all chapters
   */
  /**
   * @returns {Promise<Chapter[]>}
   */
  async getAll() {
    const res = await apiFetch('/chapters');
    return normalizeChapters(res);
  },

  /**
   * Get a single chapter by ID
   */
  /**
   * @param {string} id
   * @returns {Promise<Chapter>}
   */
  async getById(id) {
    return apiFetch(`/chapters/${id}`);
  },

  /**
   * Create a new chapter
   */
  /**
   * @param {Partial<Chapter>} chapterData
   */
  async create(chapterData) {
    return apiFetch('/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  },

  /**
   * Update a chapter
   */
  /**
   * @param {string} id
   * @param {Partial<Chapter>} chapterData
   */
  async update(id, chapterData) {
    return apiFetch(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  },

  /**
   * Delete a chapter
   */
  /**
   * @param {string} id
   */
  async delete(id) {
    return apiFetch(`/chapters/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Project API endpoints
 */
export const projectsAPI = {
  /**
   * Get all projects
   */
  async getAll() {
    return apiFetch('/projects');
  },

  /**
   * Get current/active project
   */
  async getCurrent() {
    return apiFetch('/projects/current');
  },

  /**
   * Get a single project by ID
   */
  async getById(id) {
    return apiFetch(`/projects/${id}`);
  },

  /**
   * Create a new project
   */
  async create(projectData) {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Update a project
   */
  async update(id, projectData) {
    return apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Delete a project
   */
  async delete(id) {
    return apiFetch(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Health check endpoint
 */
export async function healthCheck() {
  return await ensureBackend();
}

/**
 * Default export with all APIs
 */
export default {
  scenes: scenesAPI,
  chapters: chaptersAPI,
  projects: projectsAPI,
  healthCheck,
  build: {
    async run() {
      return apiFetch('/build', { method: 'POST' });
    },
    async artifacts() {
      return apiFetch('/build/artifacts');
    },
  },
  codegen: {
    async sceneCode(id) {
      if (FORCE_OFFLINE) throw new Error('BACKEND_OFFLINE');
      return fetch(`${API_BASE_URL}/scenes/${id}/code`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
    },
  },
};
