import type { Scene, Choice, Chapter, StateVariable } from "./types";
import { apiClient } from "./api-client";

/**
 * Database abstraction layer
 *
 * Strategy: API-first with localStorage fallback for offline support
 * - Attempts API requests first
 * - Falls back to localStorage if API fails (offline mode)
 * - Syncs localStorage cache with API responses
 */

class Database {
  private scenes: Map<string, Scene> = new Map();
  private chapters: Map<string, Chapter> = new Map();
  private states: Map<string, StateVariable> = new Map();
  private readonly STORAGE_KEY = "loke-cards-data";
  private isOnline: boolean = true;

  constructor() {
    this.loadFromStorage();
    this.checkOnlineStatus();
  }

  /**
   * Check if backend is available
   */
  private async checkOnlineStatus(): Promise<boolean> {
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

  async createScene(scene: Omit<Scene, "id">): Promise<Scene> {
    try {
      // Try API first
      const created = await apiClient.createScene(scene);
      this.scenes.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      // Fallback to local
      console.warn("API create failed, using local storage", error);
      const id = this.generateId();
      const newScene: Scene = { ...scene, id };
      this.scenes.set(id, newScene);
      this.saveToStorage();
      return newScene;
    }
  }

  async getScene(id: string): Promise<Scene | null> {
    try {
      // Try API first
      const scene = await apiClient.getScene(id);
      if (scene) {
        this.scenes.set(id, scene);
        this.saveToStorage();
      }
      return scene;
    } catch (error) {
      // Fallback to local
      console.warn("API get failed, using local storage", error);
      return this.scenes.get(id) || null;
    }
  }

  async updateScene(
    id: string,
    updates: Partial<Scene>,
  ): Promise<Scene | null> {
    try {
      // Try API first
      const updated = await apiClient.updateScene(id, updates);
      this.scenes.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      // Fallback to local
      console.warn("API update failed, using local storage", error);
      const scene = this.scenes.get(id);
      if (!scene) return null;

      const updatedScene = { ...scene, ...updates };
      this.scenes.set(id, updatedScene);
      this.saveToStorage();
      return updatedScene;
    }
  }

  async deleteScene(id: string): Promise<boolean> {
    try {
      // Try API first
      const deleted = await apiClient.deleteScene(id);
      if (deleted) {
        this.scenes.delete(id);
        this.saveToStorage();
      }
      return deleted;
    } catch (error) {
      // Fallback to local
      console.warn("API delete failed, using local storage", error);
      const deleted = this.scenes.delete(id);
      if (deleted) {
        this.saveToStorage();
      }
      return deleted;
    }
  }

  async getAllScenes(): Promise<Scene[]> {
    try {
      // Try API first
      const scenes = await apiClient.getAllScenes();
      // Update local cache
      this.scenes.clear();
      scenes.forEach((scene) => this.scenes.set(scene.id, scene));
      this.saveToStorage();
      return scenes;
    } catch (error) {
      // Fallback to local
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.scenes.values());
    }
  }

  // === Chapter Operations ===

  async createChapter(chapter: Omit<Chapter, "id">): Promise<Chapter> {
    try {
      // Try API first
      const created = await apiClient.createChapter(chapter);
      this.chapters.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      // Fallback to local
      console.warn("API create failed, using local storage", error);
      const id = this.generateId();
      const newChapter: Chapter = { ...chapter, id };
      this.chapters.set(id, newChapter);
      this.saveToStorage();
      return newChapter;
    }
  }

  async getChapter(id: string): Promise<Chapter | null> {
    try {
      // Try API first
      const chapter = await apiClient.getChapter(id);
      if (chapter) {
        this.chapters.set(id, chapter);
        this.saveToStorage();
      }
      return chapter;
    } catch (error) {
      // Fallback to local
      console.warn("API get failed, using local storage", error);
      return this.chapters.get(id) || null;
    }
  }

  async updateChapter(
    id: string,
    updates: Partial<Chapter>,
  ): Promise<Chapter | null> {
    try {
      // Try API first
      const updated = await apiClient.updateChapter(id, updates);
      this.chapters.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      // Fallback to local
      console.warn("API update failed, using local storage", error);
      const chapter = this.chapters.get(id);
      if (!chapter) return null;

      const updatedChapter = { ...chapter, ...updates };
      this.chapters.set(id, updatedChapter);
      this.saveToStorage();
      return updatedChapter;
    }
  }

  async deleteChapter(id: string): Promise<boolean> {
    try {
      // Try API first
      const deleted = await apiClient.deleteChapter(id);
      if (deleted) {
        this.chapters.delete(id);
        this.saveToStorage();
      }
      return deleted;
    } catch (error) {
      // Fallback to local
      console.warn("API delete failed, using local storage", error);
      const deleted = this.chapters.delete(id);
      if (deleted) {
        this.saveToStorage();
      }
      return deleted;
    }
  }

  async getAllChapters(): Promise<Chapter[]> {
    try {
      // Try API first
      const chapters = await apiClient.getAllChapters();
      // Update local cache
      this.chapters.clear();
      chapters.forEach((chapter) => this.chapters.set(chapter.id, chapter));
      this.saveToStorage();
      return chapters;
    } catch (error) {
      // Fallback to local
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.chapters.values());
    }
  }

  // === Utility Methods ===

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return; // Skip on server-side
    try {
      const data = {
        scenes: Array.from(this.scenes.entries()),
        chapters: Array.from(this.chapters.entries()),
        states: Array.from(this.states.entries()),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return; // Skip on server-side
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

  async createState(state: Omit<StateVariable, "id" | "createdAt" | "updatedAt">): Promise<StateVariable> {
    try {
      // Try API first
      const created = await apiClient.createState(state);
      this.states.set(created.id, created);
      this.saveToStorage();
      return created;
    } catch (error) {
      // Fallback to local
      console.warn("API create failed, using local storage", error);
      const now = Date.now();
      const id = state.name.toLowerCase().replace(/\s+/g, '_');
      const newState: StateVariable = {
        ...state,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.states.set(id, newState);
      this.saveToStorage();
      return newState;
    }
  }

  async getState(id: string): Promise<StateVariable | null> {
    try {
      // Try API first
      const stateVar = await apiClient.getState(id);
      if (stateVar) {
        this.states.set(id, stateVar);
        this.saveToStorage();
      }
      return stateVar;
    } catch (error) {
      // Fallback to local
      console.warn("API get failed, using local storage", error);
      return this.states.get(id) || null;
    }
  }

  async getAllStates(): Promise<StateVariable[]> {
    try {
      // Try API first
      const states = await apiClient.getAllStates();
      this.states.clear();
      states.forEach((stateVar) => this.states.set(stateVar.id, stateVar));
      this.saveToStorage();
      return states;
    } catch (error) {
      // Fallback to local
      console.warn("API get all failed, using local storage", error);
      return Array.from(this.states.values());
    }
  }

  async updateState(
    id: string,
    updates: Partial<Omit<StateVariable, "id" | "name" | "createdAt">>,
  ): Promise<StateVariable | null> {
    try {
      // Try API first
      const updated = await apiClient.updateState(id, updates);
      this.states.set(id, updated);
      this.saveToStorage();
      return updated;
    } catch (error) {
      // Fallback to local
      console.warn("API update failed, using local storage", error);
      const state = this.states.get(id);
      if (!state) return null;

      const updatedState = {
        ...state,
        ...updates,
        id: state.id, // Immutable
        name: state.name, // Immutable
        createdAt: state.createdAt, // Immutable
        updatedAt: Date.now(),
      };

      this.states.set(id, updatedState);
      this.saveToStorage();
      return updatedState;
    }
  }

  async deleteState(id: string): Promise<boolean> {
    try {
      // Try API first
      const success = await apiClient.deleteState(id);
      if (success) {
        this.states.delete(id);
        this.saveToStorage();
      }
      return success;
    } catch (error) {
      // Fallback to local
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
  async clear(): Promise<void> {
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
  async syncFromApi(): Promise<void> {
    try {
      const [scenes, chapters, states] = await Promise.all([
        apiClient.getAllScenes(),
        apiClient.getAllChapters(),
        apiClient.getAllStates(),
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
  getOnlineStatus(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
export const db = new Database();

// Export types for external use
export type { Scene, Choice, Chapter, StateVariable };
