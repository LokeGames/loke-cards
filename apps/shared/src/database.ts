import type { Scene, Choice, Chapter } from "./types";

// Simple in-memory database with localStorage persistence
class Database {
  private scenes: Map<string, Scene> = new Map();
  private chapters: Map<string, Chapter> = new Map();
  private readonly STORAGE_KEY = "loke-cards-data";

  constructor() {
    this.loadFromStorage();
  }

  // Scene operations
  async createScene(scene: Omit<Scene, "id">): Promise<Scene> {
    const id = this.generateId();
    const newScene: Scene = { ...scene, id };
    this.scenes.set(id, newScene);
    this.saveToStorage();
    return newScene;
  }

  async getScene(id: string): Promise<Scene | null> {
    return this.scenes.get(id) || null;
  }

  async updateScene(
    id: string,
    updates: Partial<Scene>,
  ): Promise<Scene | null> {
    const scene = this.scenes.get(id);
    if (!scene) return null;

    const updatedScene = { ...scene, ...updates };
    this.scenes.set(id, updatedScene);
    this.saveToStorage();
    return updatedScene;
  }

  async deleteScene(id: string): Promise<boolean> {
    const deleted = this.scenes.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  async getAllScenes(): Promise<Scene[]> {
    return Array.from(this.scenes.values());
  }

  // Chapter operations
  async createChapter(chapter: Omit<Chapter, "id">): Promise<Chapter> {
    const id = this.generateId();
    const newChapter: Chapter = { ...chapter, id };
    this.chapters.set(id, newChapter);
    this.saveToStorage();
    return newChapter;
  }

  async getChapter(id: string): Promise<Chapter | null> {
    return this.chapters.get(id) || null;
  }

  async updateChapter(
    id: string,
    updates: Partial<Chapter>,
  ): Promise<Chapter | null> {
    const chapter = this.chapters.get(id);
    if (!chapter) return null;

    const updatedChapter = { ...chapter, ...updates };
    this.chapters.set(id, updatedChapter);
    this.saveToStorage();
    return updatedChapter;
  }

  async deleteChapter(id: string): Promise<boolean> {
    const deleted = this.chapters.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  async getAllChapters(): Promise<Chapter[]> {
    return Array.from(this.chapters.values());
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
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
  async clear(): Promise<void> {
    this.scenes.clear();
    this.chapters.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Singleton instance
export const db = new Database();

// Export types for external use
export type { Scene, Choice, Chapter };
