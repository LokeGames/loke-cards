/**
 * LocalForage Storage Schema and Utilities
 * Manages offline storage for scenes, chapters, and drafts
 */

import localforage from 'localforage';

// Initialize storage instances
export const sceneStore = localforage.createInstance({
  name: 'loke-cards',
  storeName: 'scenes',
  description: 'Scene data storage'
});

export const chapterStore = localforage.createInstance({
  name: 'loke-cards',
  storeName: 'chapters',
  description: 'Chapter metadata storage'
});

export const draftStore = localforage.createInstance({
  name: 'loke-cards',
  storeName: 'drafts',
  description: 'Draft scenes (not yet saved to server)'
});

export const projectStore = localforage.createInstance({
  name: 'loke-cards',
  storeName: 'projects',
  description: 'Project metadata'
});

// Storage Schema Types

/**
 * @typedef {Object} Scene
 * @property {string} id - Unique scene identifier (e.g., "scene_ch01_intro")
 * @property {string} sceneId - Function name (e.g., "scene_ch01_intro")
 * @property {string} chapter - Chapter name (e.g., "chapter01")
 * @property {string} sceneText - Scene description text
 * @property {Array<Choice>} choices - Array of choices
 * @property {Array<StateChange>} stateChanges - Array of state modifications
 * @property {string} generatedCode - Generated C code
 * @property {number} createdAt - Timestamp
 * @property {number} updatedAt - Timestamp
 * @property {boolean} synced - Whether synced to server
 */

/**
 * @typedef {Object} Choice
 * @property {string} text - Choice display text
 * @property {string} nextScene - Next scene function name
 * @property {boolean} enabled - Whether choice is enabled
 * @property {string} condition - Optional condition (e.g., "state->has_key")
 */

/**
 * @typedef {Object} StateChange
 * @property {string} variable - State variable name (e.g., "gold")
 * @property {string} operator - Operator (=, +=, -=, etc.)
 * @property {string} value - Value or expression
 */

/**
 * @typedef {Object} Chapter
 * @property {string} id - Chapter identifier (e.g., "chapter01")
 * @property {string} name - Display name (e.g., "Chapter 1: Awakening")
 * @property {Array<string>} scenes - Array of scene IDs
 * @property {number} order - Chapter order number
 * @property {number} createdAt - Timestamp
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Project identifier
 * @property {string} name - Project name
 * @property {Array<string>} chapters - Array of chapter IDs
 * @property {number} sceneCount - Total scene count
 * @property {number} createdAt - Timestamp
 * @property {number} updatedAt - Timestamp
 */

// Scene Operations

export async function saveScene(scene) {
  scene.updatedAt = Date.now();
  if (!scene.createdAt) {
    scene.createdAt = scene.updatedAt;
  }
  await sceneStore.setItem(scene.id, scene);
  return scene;
}

export async function getScene(sceneId) {
  return await sceneStore.getItem(sceneId);
}

export async function getAllScenes() {
  const scenes = [];
  await sceneStore.iterate((value) => {
    scenes.push(value);
  });
  return scenes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getScenesByChapter(chapterId) {
  const scenes = [];
  await sceneStore.iterate((value) => {
    if (value.chapter === chapterId) {
      scenes.push(value);
    }
  });
  return scenes.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteScene(sceneId) {
  await sceneStore.removeItem(sceneId);
}

// Chapter Operations

export async function saveChapter(chapter) {
  chapter.updatedAt = Date.now();
  if (!chapter.createdAt) {
    chapter.createdAt = chapter.updatedAt;
  }
  await chapterStore.setItem(chapter.id, chapter);
  return chapter;
}

export async function getChapter(chapterId) {
  return await chapterStore.getItem(chapterId);
}

export async function getAllChapters() {
  const chapters = [];
  await chapterStore.iterate((value) => {
    chapters.push(value);
  });
  return chapters.sort((a, b) => a.order - b.order);
}

export async function deleteChapter(chapterId) {
  await chapterStore.removeItem(chapterId);
}

// Draft Operations (auto-save)

export async function saveDraft(sceneId, draftData) {
  const draft = {
    sceneId,
    data: draftData,
    timestamp: Date.now()
  };
  await draftStore.setItem(sceneId, draft);
  return draft;
}

export async function getDraft(sceneId) {
  return await draftStore.getItem(sceneId);
}

export async function deleteDraft(sceneId) {
  await draftStore.removeItem(sceneId);
}

export async function getAllDrafts() {
  const drafts = [];
  await draftStore.iterate((value) => {
    drafts.push(value);
  });
  return drafts.sort((a, b) => b.timestamp - a.timestamp);
}

// Project Operations

export async function saveProject(project) {
  project.updatedAt = Date.now();
  if (!project.createdAt) {
    project.createdAt = project.updatedAt;
  }
  await projectStore.setItem(project.id, project);
  return project;
}

export async function getProject(projectId) {
  return await projectStore.getItem(projectId);
}

export async function getCurrentProject() {
  // Get the first project (for MVP we only support one project)
  let currentProject = null;
  await projectStore.iterate((value) => {
    if (!currentProject) {
      currentProject = value;
    }
  });

  // Create default project if none exists
  if (!currentProject) {
    currentProject = await createDefaultProject();
  }

  return currentProject;
}

export async function createDefaultProject() {
  const project = {
    id: 'default',
    name: import.meta.env.VITE_PROJECT_NAME || 'My Adventure',
    chapters: [],
    sceneCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await saveProject(project);
  return project;
}

// Utility Functions

export async function clearAllData() {
  await sceneStore.clear();
  await chapterStore.clear();
  await draftStore.clear();
  await projectStore.clear();
}

export async function getStorageStats() {
  const sceneCount = await sceneStore.length();
  const chapterCount = await chapterStore.length();
  const draftCount = await draftStore.length();

  return {
    scenes: sceneCount,
    chapters: chapterCount,
    drafts: draftCount
  };
}

export async function exportData() {
  const data = {
    scenes: await getAllScenes(),
    chapters: await getAllChapters(),
    project: await getCurrentProject(),
    exportedAt: Date.now()
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonData) {
  const data = JSON.parse(jsonData);

  // Import chapters
  if (data.chapters) {
    for (const chapter of data.chapters) {
      await saveChapter(chapter);
    }
  }

  // Import scenes
  if (data.scenes) {
    for (const scene of data.scenes) {
      await saveScene(scene);
    }
  }

  // Import project
  if (data.project) {
    await saveProject(data.project);
  }

  return data;
}
