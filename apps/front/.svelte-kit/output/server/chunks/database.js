class ApiClient {
  constructor() {
    this.baseUrl = "http://localhost:3000";
  }
  /**
   * Set custom API base URL (useful for settings)
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }
  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} ${error}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }
  /**
   * Parse backend data field (backend stores JSON in "data" field)
   */
  parseDataField(item) {
    try {
      return JSON.parse(item.data);
    } catch (error) {
      console.error("Failed to parse data field:", item);
      throw error;
    }
  }
  // === Health Check ===
  async health() {
    return this.request("/api/health");
  }
  // === Scene Operations ===
  async getAllScenes() {
    const response = await this.request(
      "/api/scenes"
    );
    return response.map((item) => this.parseDataField(item));
  }
  async getScene(id) {
    try {
      const response = await this.request(
        `/api/scenes/${id}`
      );
      if (response.data && typeof response.data === "string") {
        return this.parseDataField(response);
      } else {
        return response;
      }
    } catch (error) {
      console.error(`Scene not found: ${id}`);
      return null;
    }
  }
  async createScene(scene) {
    const sceneWithId = {
      ...scene,
      id: scene.sceneId || this.generateId()
    };
    const response = await this.request(
      "/api/scenes",
      {
        method: "POST",
        body: JSON.stringify(sceneWithId)
      }
    );
    return this.parseDataField(response);
  }
  async updateScene(id, updates) {
    const response = await this.request(
      `/api/scenes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...updates, id })
      }
    );
    return this.parseDataField(response);
  }
  async deleteScene(id) {
    try {
      await this.request(`/api/scenes/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete scene: ${id}`, error);
      return false;
    }
  }
  // === Chapter Operations ===
  async getAllChapters() {
    const response = await this.request(
      "/api/chapters"
    );
    return response.map((item) => this.parseDataField(item));
  }
  async getChapter(id) {
    try {
      const response = await this.request(
        `/api/chapters/${id}`
      );
      if (response.data && typeof response.data === "string") {
        return this.parseDataField(response);
      } else {
        return response;
      }
    } catch (error) {
      console.error(`Chapter not found: ${id}`);
      return null;
    }
  }
  async createChapter(chapter) {
    const chapterWithId = {
      ...chapter,
      id: chapter.name || this.generateId()
    };
    const response = await this.request(
      "/api/chapters",
      {
        method: "POST",
        body: JSON.stringify(chapterWithId)
      }
    );
    return this.parseDataField(response);
  }
  async updateChapter(id, updates) {
    const response = await this.request(
      `/api/chapters/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...updates, id })
      }
    );
    return this.parseDataField(response);
  }
  async deleteChapter(id) {
    try {
      await this.request(`/api/chapters/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete chapter: ${id}`, error);
      return false;
    }
  }
  // === State Operations ===
  async getAllStates() {
    const response = await this.request(
      "/api/states"
    );
    return response.map((item) => this.parseDataField(item));
  }
  async getState(id) {
    try {
      const response = await this.request(
        `/api/states/${id}`
      );
      if (response.data && typeof response.data === "string") {
        return this.parseDataField(response);
      } else {
        return response;
      }
    } catch (error) {
      console.error(`State not found: ${id}`);
      return null;
    }
  }
  async createState(state) {
    const now = Date.now();
    const id = state.name.toLowerCase().replace(/\s+/g, "_");
    const stateWithId = {
      ...state,
      id,
      createdAt: now,
      updatedAt: now
    };
    const response = await this.request(
      "/api/states",
      {
        method: "POST",
        body: JSON.stringify(stateWithId)
      }
    );
    return this.parseDataField(response);
  }
  async updateState(id, updates) {
    const updatedState = {
      ...updates,
      id,
      updatedAt: Date.now()
    };
    const response = await this.request(
      `/api/states/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedState)
      }
    );
    return this.parseDataField(response);
  }
  async deleteState(id) {
    try {
      await this.request(`/api/states/${id}`, {
        method: "DELETE"
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete state: ${id}`, error);
      return false;
    }
  }
  // === Project Operations (v0.2.0) ===
  /**
   * List all projects with stats
   */
  async listProjects() {
    return this.request("/api/projects");
  }
  /**
   * Get current project info
   */
  async getCurrentProject() {
    return this.request("/api/projects/current");
  }
  /**
   * Create new project
   */
  async createProject(name) {
    return this.request("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name })
    });
  }
  /**
   * Switch to different project
   */
  async switchProject(projectId) {
    return this.request("/api/projects/switch", {
      method: "POST",
      body: JSON.stringify({ project: projectId })
    });
  }
  // === Utility ===
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
const apiClient = new ApiClient();
class Database {
  constructor() {
    this.scenes = /* @__PURE__ */ new Map();
    this.chapters = /* @__PURE__ */ new Map();
    this.states = /* @__PURE__ */ new Map();
    this.STORAGE_KEY = "loke-cards-data";
    this.isOnline = true;
    this.loadFromStorage();
    this.checkOnlineStatus();
  }
  /**
   * Check if backend is available
   */
  async checkOnlineStatus() {
    try {
      await apiClient.health();
      this.isOnline = true;
      return true;
    } catch (error) {
      this.isOnline = false;
      console.warn("Backend unavailable, using offline mode");
      return false;
    }
  }
  // === Scene Operations ===
  async createScene(scene) {
    try {
      const created = await apiClient.createScene(scene);
      this.scenes.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      console.warn("API create failed, using local storage", error);
      const id = this.generateId();
      const newScene = { ...scene, id };
      this.scenes.set(id, newScene);
      this.saveToStorage();
      return newScene;
    }
  }
  async getScene(id) {
    try {
      const scene = await apiClient.getScene(id);
      if (scene) {
        this.scenes.set(id, scene);
        this.saveToStorage();
      }
      return scene;
    } catch (error) {
      console.warn("API get failed, using local storage", error);
      return this.scenes.get(id) || null;
    }
  }
  async updateScene(id, updates) {
    try {
      const updated = await apiClient.updateScene(id, updates);
      this.scenes.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      console.warn("API update failed, using local storage", error);
      const scene = this.scenes.get(id);
      if (!scene) return null;
      const updatedScene = { ...scene, ...updates };
      this.scenes.set(id, updatedScene);
      this.saveToStorage();
      return updatedScene;
    }
  }
  async deleteScene(id) {
    try {
      const deleted = await apiClient.deleteScene(id);
      if (deleted) {
        this.scenes.delete(id);
        this.saveToStorage();
      }
      return deleted;
    } catch (error) {
      console.warn("API delete failed, using local storage", error);
      const deleted = this.scenes.delete(id);
      if (deleted) {
        this.saveToStorage();
      }
      return deleted;
    }
  }
  async getAllScenes() {
    try {
      const scenes = await apiClient.getAllScenes();
      this.scenes.clear();
      scenes.forEach((scene) => this.scenes.set(scene.id, scene));
      this.saveToStorage();
      return scenes;
    } catch (error) {
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.scenes.values());
    }
  }
  // === Chapter Operations ===
  async createChapter(chapter) {
    try {
      const created = await apiClient.createChapter(chapter);
      this.chapters.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      console.warn("API create failed, using local storage", error);
      const id = this.generateId();
      const newChapter = { ...chapter, id };
      this.chapters.set(id, newChapter);
      this.saveToStorage();
      return newChapter;
    }
  }
  async getChapter(id) {
    try {
      const chapter = await apiClient.getChapter(id);
      if (chapter) {
        this.chapters.set(id, chapter);
        this.saveToStorage();
      }
      return chapter;
    } catch (error) {
      console.warn("API get failed, using local storage", error);
      return this.chapters.get(id) || null;
    }
  }
  async updateChapter(id, updates) {
    try {
      const updated = await apiClient.updateChapter(id, updates);
      this.chapters.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      console.warn("API update failed, using local storage", error);
      const chapter = this.chapters.get(id);
      if (!chapter) return null;
      const updatedChapter = { ...chapter, ...updates };
      this.chapters.set(id, updatedChapter);
      this.saveToStorage();
      return updatedChapter;
    }
  }
  async deleteChapter(id) {
    try {
      const deleted = await apiClient.deleteChapter(id);
      if (deleted) {
        this.chapters.delete(id);
        this.saveToStorage();
      }
      return deleted;
    } catch (error) {
      console.warn("API delete failed, using local storage", error);
      const deleted = this.chapters.delete(id);
      if (deleted) {
        this.saveToStorage();
      }
      return deleted;
    }
  }
  async getAllChapters() {
    try {
      const chapters = await apiClient.getAllChapters();
      this.chapters.clear();
      chapters.forEach((chapter) => this.chapters.set(chapter.id, chapter));
      this.saveToStorage();
      return chapters;
    } catch (error) {
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.chapters.values());
    }
  }
  // === Utility Methods ===
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const data = {
        scenes: Array.from(this.scenes.entries()),
        chapters: Array.from(this.chapters.entries()),
        states: Array.from(this.states.entries())
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }
  loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.scenes = new Map(data.scenes || []);
        this.chapters = new Map(data.chapters || []);
        this.states = new Map(data.states || []);
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }
  // === State Variable Operations ===
  async createState(state) {
    try {
      const created = await apiClient.createState(state);
      this.states.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      console.warn("API create failed, using local storage", error);
      const now = Date.now();
      const id = state.name.toLowerCase().replace(/\s+/g, "_");
      const newState = {
        ...state,
        id,
        createdAt: now,
        updatedAt: now
      };
      this.states.set(id, newState);
      this.saveToStorage();
      return newState;
    }
  }
  async getState(id) {
    try {
      const stateVar = await apiClient.getState(id);
      if (stateVar) {
        this.states.set(id, stateVar);
        this.saveToStorage();
      }
      return stateVar;
    } catch (error) {
      console.warn("API get failed, using local storage", error);
      return this.states.get(id) || null;
    }
  }
  async getAllStates() {
    try {
      const states = await apiClient.getAllStates();
      this.states.clear();
      states.forEach((stateVar) => this.states.set(stateVar.id, stateVar));
      this.saveToStorage();
      return states;
    } catch (error) {
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.states.values());
    }
  }
  async updateState(id, updates) {
    try {
      const updated = await apiClient.updateState(id, updates);
      this.states.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      console.warn("API update failed, using local storage", error);
      const state = this.states.get(id);
      if (!state) return null;
      const updatedState = {
        ...state,
        ...updates,
        id: state.id,
        // Immutable
        name: state.name,
        // Immutable
        createdAt: state.createdAt,
        // Immutable
        updatedAt: Date.now()
      };
      this.states.set(id, updatedState);
      this.saveToStorage();
      return updatedState;
    }
  }
  async deleteState(id) {
    try {
      const success = await apiClient.deleteState(id);
      if (success) {
        this.states.delete(id);
        this.saveToStorage();
      }
      return success;
    } catch (error) {
      console.warn("API delete failed, using local storage", error);
      const deleted = this.states.delete(id);
      if (deleted) {
        this.saveToStorage();
      }
      return deleted;
    }
  }
  /**
   * Clear all data (both API and local cache)
   */
  async clear() {
    this.scenes.clear();
    this.chapters.clear();
    this.states.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
  /**
   * Force sync from API (refresh local cache)
   */
  async syncFromApi() {
    try {
      const [scenes, chapters, states] = await Promise.all([
        apiClient.getAllScenes(),
        apiClient.getAllChapters(),
        apiClient.getAllStates()
      ]);
      this.scenes.clear();
      this.chapters.clear();
      this.states.clear();
      scenes.forEach((scene) => this.scenes.set(scene.id, scene));
      chapters.forEach((chapter) => this.chapters.set(chapter.id, chapter));
      states.forEach((stateVar) => this.states.set(stateVar.id, stateVar));
      this.saveToStorage();
      console.log("Synced from API successfully");
    } catch (error) {
      console.error("Failed to sync from API", error);
      throw error;
    }
  }
  /**
   * Get online status
   */
  getOnlineStatus() {
    return this.isOnline;
  }
}
new Database();
