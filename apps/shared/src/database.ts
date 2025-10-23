import type { Scene, Choice, Chapter } from "./types";
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
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }

  /**
   * Clear all data (both API and local cache)
   */
  async clear(): Promise<void> {
    this.scenes.clear();
    this.chapters.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Force sync from API (refresh local cache)
   */
  async syncFromApi(): Promise<void> {
    try {
      const [scenes, chapters] = await Promise.all([
        apiClient.getAllScenes(),
        apiClient.getAllChapters(),
      ]);

      this.scenes.clear();
      this.chapters.clear();

      scenes.forEach((scene) => this.scenes.set(scene.id, scene));
      chapters.forEach((chapter) => this.chapters.set(chapter.id, chapter));

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
export type { Scene, Choice, Chapter };
