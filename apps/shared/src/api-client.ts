import type { Scene, Chapter, StateVariable } from "./types";

/**
 * API Client for communicating with loke-cards backend server (SQLite)
 *
 * Backend endpoints:
 * - GET /api/health - Health check
 * - GET /api/scenes - List all scenes
 * - GET /api/scenes/:id - Get scene by ID
 * - POST /api/scenes - Create scene
 * - PUT /api/scenes/:id - Update scene
 * - DELETE /api/scenes/:id - Delete scene
 * - GET /api/chapters - List all chapters
 * - GET /api/chapters/:id - Get chapter by ID
 * - POST /api/chapters - Create chapter
 * - PUT /api/chapters/:id - Update chapter
 * - DELETE /api/chapters/:id - Delete chapter
 * - GET /api/states - List all states
 * - GET /api/states/:id - Get state by ID
 * - POST /api/states - Create state
 * - PUT /api/states/:id - Update state
 * - DELETE /api/states/:id - Delete state
 */

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Default to localhost, can be overridden by environment variable
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  }

  /**
   * Set custom API base URL (useful for settings)
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
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
  private parseDataField<T>(item: { id: string; data: string }): T {
    try {
      return JSON.parse(item.data) as T;
    } catch (error) {
      console.error("Failed to parse data field:", item);
      throw error;
    }
  }

  // === Health Check ===

  async health(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/api/health");
  }

  // === Scene Operations ===

  async getAllScenes(): Promise<Scene[]> {
    const response = await this.request<Array<{ id: string; data: string }>>(
      "/api/scenes",
    );
    return response.map((item) => this.parseDataField<Scene>(item));
  }

  async getScene(id: string): Promise<Scene | null> {
    try {
      const response = await this.request<any>(
        `/api/scenes/${id}`,
      );

      // Handle both formats: {id, data: "json"} and direct JSON
      if (response.data && typeof response.data === 'string') {
        return this.parseDataField<Scene>(response);
      } else {
        return response as Scene;
      }
    } catch (error) {
      console.error(`Scene not found: ${id}`);
      return null;
    }
  }

  async createScene(scene: Omit<Scene, "id">): Promise<Scene> {
    // Backend expects id in the body and uses POST /api/scenes
    const sceneWithId = {
      ...scene,
      id: scene.sceneId || this.generateId(),
    };

    const response = await this.request<{ id: string; data: string }>(
      "/api/scenes",
      {
        method: "POST",
        body: JSON.stringify(sceneWithId),
      },
    );

    return this.parseDataField<Scene>(response);
  }

  async updateScene(id: string, updates: Partial<Scene>): Promise<Scene> {
    const response = await this.request<{ id: string; data: string }>(
      `/api/scenes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...updates, id }),
      },
    );

    return this.parseDataField<Scene>(response);
  }

  async deleteScene(id: string): Promise<boolean> {
    try {
      await this.request(`/api/scenes/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete scene: ${id}`, error);
      return false;
    }
  }

  // === Chapter Operations ===

  async getAllChapters(): Promise<Chapter[]> {
    const response = await this.request<Array<{ id: string; data: string }>>(
      "/api/chapters",
    );
    return response.map((item) => this.parseDataField<Chapter>(item));
  }

  async getChapter(id: string): Promise<Chapter | null> {
    try {
      const response = await this.request<any>(
        `/api/chapters/${id}`,
      );

      // Handle both formats: {id, data: "json"} and direct JSON
      if (response.data && typeof response.data === 'string') {
        return this.parseDataField<Chapter>(response);
      } else {
        return response as Chapter;
      }
    } catch (error) {
      console.error(`Chapter not found: ${id}`);
      return null;
    }
  }

  async createChapter(chapter: Omit<Chapter, "id">): Promise<Chapter> {
    const chapterWithId = {
      ...chapter,
      id: chapter.name || this.generateId(),
    };

    const response = await this.request<{ id: string; data: string }>(
      "/api/chapters",
      {
        method: "POST",
        body: JSON.stringify(chapterWithId),
      },
    );

    return this.parseDataField<Chapter>(response);
  }

  async updateChapter(
    id: string,
    updates: Partial<Chapter>,
  ): Promise<Chapter> {
    const response = await this.request<{ id: string; data: string }>(
      `/api/chapters/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...updates, id }),
      },
    );

    return this.parseDataField<Chapter>(response);
  }

  async deleteChapter(id: string): Promise<boolean> {
    try {
      await this.request(`/api/chapters/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete chapter: ${id}`, error);
      return false;
    }
  }

  // === State Operations ===

  async getAllStates(): Promise<StateVariable[]> {
    const response = await this.request<Array<{ id: string; data: string }>>(
      "/api/states",
    );
    return response.map((item) => this.parseDataField<StateVariable>(item));
  }

  async getState(id: string): Promise<StateVariable | null> {
    try {
      const response = await this.request<any>(
        `/api/states/${id}`,
      );

      // Handle both formats: {id, data: "json"} and direct JSON
      if (response.data && typeof response.data === 'string') {
        return this.parseDataField<StateVariable>(response);
      } else {
        return response as StateVariable;
      }
    } catch (error) {
      console.error(`State not found: ${id}`);
      return null;
    }
  }

  async createState(state: Omit<StateVariable, "id" | "createdAt" | "updatedAt">): Promise<StateVariable> {
    const now = Date.now();
    const id = state.name.toLowerCase().replace(/\s+/g, '_');
    const stateWithId = {
      ...state,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const response = await this.request<{ id: string; data: string }>(
      "/api/states",
      {
        method: "POST",
        body: JSON.stringify(stateWithId),
      },
    );

    return this.parseDataField<StateVariable>(response);
  }

  async updateState(
    id: string,
    updates: Partial<Omit<StateVariable, "id" | "name" | "createdAt">>,
  ): Promise<StateVariable> {
    const updatedState = {
      ...updates,
      id,
      updatedAt: Date.now(),
    };

    const response = await this.request<{ id: string; data: string }>(
      `/api/states/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedState),
      },
    );

    return this.parseDataField<StateVariable>(response);
  }

  async deleteState(id: string): Promise<boolean> {
    try {
      await this.request(`/api/states/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete state: ${id}`, error);
      return false;
    }
  }

  // === Utility ===

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export for external use
export type { Scene, Chapter, StateVariable };
