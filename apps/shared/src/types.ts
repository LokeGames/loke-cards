// Shared types for Loke Cards

/**
 * Choice in a scene - represents a player decision
 */
export interface Choice {
  text: string;
  nextScene: string;
  enabled?: boolean;
}

/**
 * State change - modifies game state when scene is entered
 */
export interface StateChange {
  variable: string;
  operator: string; // =, +=, -=, *=, /=
  value: string | number;
}

/**
 * Scene - A single narrative scene/moment in the game
 * Backend format: {id, chapterId, sceneText, choices, stateChanges}
 */
export interface Scene {
  id: string;                    // Unique identifier (same as sceneId)
  sceneId?: string;              // Scene function name (scene_forest_entrance)
  chapterId?: string;            // Parent chapter ID
  chapter?: string;              // Alias for chapterId (backend compatibility)
  sceneText: string;             // Scene description text
  choices?: Choice[];            // Player choices
  stateChanges?: StateChange[];  // State modifications
  projectId?: string;            // Project identifier
  meta?: string;                 // Metadata/notes

  // Optional UI fields
  title?: string;                // Display title
  content?: string;              // Alias for sceneText
  createdAt?: string;            // ISO date string
  updatedAt?: string;            // ISO date string
}

/**
 * Chapter - Collection of scenes
 * Backend format: {id, name, projectId}
 */
export interface Chapter {
  id: string;                    // Unique identifier (chapter01)
  chapterId?: string;            // Alias for id
  name?: string;                 // Display name
  title?: string;                // Display title (alias for name)
  description?: string;          // Chapter description
  projectId?: string;            // Project identifier
  meta?: string;                 // Metadata/notes
  scenes?: Scene[];              // Scenes in this chapter (not stored in backend)

  // Optional UI fields
  createdAt?: string;            // ISO date string
  updatedAt?: string;            // ISO date string
}

/**
 * Project - Top-level container (for future multi-project support)
 */
export interface Project {
  id: string;                    // Project identifier
  name: string;                  // Display name
  description?: string;          // Project description
  created?: string;              // ISO date string
  modified?: string;             // ISO date string
  sceneCount?: number;           // Number of scenes
  chapterCount?: number;         // Number of chapters
}
