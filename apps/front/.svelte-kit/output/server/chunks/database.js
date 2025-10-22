class Database {
  constructor() {
    this.scenes = /* @__PURE__ */ new Map();
    this.chapters = /* @__PURE__ */ new Map();
    this.STORAGE_KEY = "loke-cards-data";
    this.loadFromStorage();
  }
  // Scene operations
  async createScene(scene) {
    const id = this.generateId();
    const newScene = { ...scene, id };
    this.scenes.set(id, newScene);
    this.saveToStorage();
    return newScene;
  }
  async getScene(id) {
    return this.scenes.get(id) || null;
  }
  async updateScene(id, updates) {
    const scene = this.scenes.get(id);
    if (!scene) return null;
    const updatedScene = { ...scene, ...updates };
    this.scenes.set(id, updatedScene);
    this.saveToStorage();
    return updatedScene;
  }
  async deleteScene(id) {
    const deleted = this.scenes.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
  async getAllScenes() {
    return Array.from(this.scenes.values());
  }
  // Chapter operations
  async createChapter(chapter) {
    const id = this.generateId();
    const newChapter = { ...chapter, id };
    this.chapters.set(id, newChapter);
    this.saveToStorage();
    return newChapter;
  }
  async getChapter(id) {
    return this.chapters.get(id) || null;
  }
  async updateChapter(id, updates) {
    const chapter = this.chapters.get(id);
    if (!chapter) return null;
    const updatedChapter = { ...chapter, ...updates };
    this.chapters.set(id, updatedChapter);
    this.saveToStorage();
    return updatedChapter;
  }
  async deleteChapter(id) {
    const deleted = this.chapters.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
  async getAllChapters() {
    return Array.from(this.chapters.values());
  }
  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const data = {
        scenes: Array.from(this.scenes.entries()),
        chapters: Array.from(this.chapters.entries())
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
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }
  // Clear all data
  async clear() {
    this.scenes.clear();
    this.chapters.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
const db = new Database();
export {
  db as d
};
