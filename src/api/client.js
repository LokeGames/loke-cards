/**
 * API Client for loke-cards backend
 *
 * Communicates with the C++ backend server (port 3000)
 * Handles all HTTP requests for scenes, chapters, and projects
 */

// Base URL for API (from environment variable or default to relative '/api' so Vite proxy works in dev)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

/**
 * Scene API endpoints
 */
export const scenesAPI = {
  /**
   * Get all scenes
   */
  async getAll() {
    return apiFetch('/scenes');
  },

  /**
   * Get a single scene by ID
   */
  async getById(id) {
    return apiFetch(`/scenes/${id}`);
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
  async create(sceneData) {
    return apiFetch('/scenes', {
      method: 'POST',
      body: JSON.stringify(sceneData),
    });
  },

  /**
   * Update an existing scene
   */
  async update(id, sceneData) {
    return apiFetch(`/scenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sceneData),
    });
  },

  /**
   * Delete a scene
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
  async getAll() {
    return apiFetch('/chapters');
  },

  /**
   * Get a single chapter by ID
   */
  async getById(id) {
    return apiFetch(`/chapters/${id}`);
  },

  /**
   * Create a new chapter
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
  async update(id, chapterData) {
    return apiFetch(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  },

  /**
   * Delete a chapter
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
  try {
    const response = await apiFetch('/health');
    return response.status === 'ok';
  } catch (error) {
    return false;
  }
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
      return fetch(`${API_BASE_URL}/scenes/${id}/code`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
    },
  },
};
