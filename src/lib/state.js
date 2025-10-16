/**
 * State Management
 * Reactive state management for loke-cards application
 */

import { getCurrentProject as loadCurrentProject, saveProject, getStorageStats } from './storage.js';
import { updateProjectInfo } from '../components/Layout.js';
import { updateSyncStatus } from '../components/Navigation.js';

// Application state
const state = {
  currentProject: null,
  currentChapter: null,
  currentScene: null,
  stats: {
    scenes: 0,
    chapters: 0,
    drafts: 0
  },
  syncStatus: 'synced', // synced, syncing, offline, error
  isOnline: navigator.onLine,
  listeners: {}
};

// Event emitter for state changes
export function on(event, callback) {
  if (!state.listeners[event]) {
    state.listeners[event] = [];
  }
  state.listeners[event].push(callback);
}

export function emit(event, data) {
  if (state.listeners[event]) {
    state.listeners[event].forEach(callback => callback(data));
  }
}

// Initialize state
export async function initState() {
  // Load current project
  state.currentProject = await loadCurrentProject();

  // Load stats
  state.stats = await getStorageStats();

  // Update UI
  updateProjectInfo({
    name: state.currentProject?.name || 'Loading...',
    scenes: state.stats.scenes,
    chapters: state.stats.chapters
  });

  updateSyncStatus(state.syncStatus);

  // Setup online/offline listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Emit initialized event
  emit('initialized', state);

  return state;
}

// Getters
export function getState() {
  return { ...state };
}

export function getCurrentProject() {
  return state.currentProject;
}

export function getCurrentChapter() {
  return state.currentChapter;
}

export function getCurrentScene() {
  return state.currentScene;
}

export function getSyncStatus() {
  return state.syncStatus;
}

export function isOnline() {
  return state.isOnline;
}

// Setters
export function setCurrentProject(project) {
  state.currentProject = project;
  updateProjectInfo({
    name: project?.name || 'No Project',
    scenes: state.stats.scenes,
    chapters: state.stats.chapters
  });
  emit('projectChanged', project);
}

export function setCurrentChapter(chapter) {
  state.currentChapter = chapter;
  emit('chapterChanged', chapter);
}

export function setCurrentScene(scene) {
  state.currentScene = scene;
  emit('sceneChanged', scene);
}

export function setSyncStatus(status) {
  state.syncStatus = status;
  updateSyncStatus(status);
  emit('syncStatusChanged', status);
}

// Stats management
export async function refreshStats() {
  state.stats = await getStorageStats();
  updateProjectInfo({
    name: state.currentProject?.name || 'No Project',
    scenes: state.stats.scenes,
    chapters: state.stats.chapters
  });
  emit('statsChanged', state.stats);
  return state.stats;
}

export function incrementSceneCount() {
  state.stats.scenes++;
  refreshStats();
}

export function decrementSceneCount() {
  state.stats.scenes = Math.max(0, state.stats.scenes - 1);
  refreshStats();
}

export function incrementChapterCount() {
  state.stats.chapters++;
  refreshStats();
}

export function decrementChapterCount() {
  state.stats.chapters = Math.max(0, state.stats.chapters - 1);
  refreshStats();
}

// Online/Offline handlers
function handleOnline() {
  state.isOnline = true;
  setSyncStatus('syncing');
  emit('online', true);

  // Trigger sync of pending changes
  setTimeout(() => {
    syncPendingChanges();
  }, 1000);
}

function handleOffline() {
  state.isOnline = false;
  setSyncStatus('offline');
  emit('offline', true);
}

// Sync management
let syncQueue = [];

export function queueSync(operation) {
  syncQueue.push({
    operation,
    timestamp: Date.now()
  });

  if (state.isOnline) {
    syncPendingChanges();
  }
}

async function syncPendingChanges() {
  if (syncQueue.length === 0) {
    setSyncStatus('synced');
    return;
  }

  setSyncStatus('syncing');

  try {
    // Process sync queue (TODO: implement actual API calls)
    for (const item of syncQueue) {
      console.log('Syncing:', item.operation);
      // await apiCall(item.operation);
    }

    syncQueue = [];
    setSyncStatus('synced');
    emit('syncComplete', true);
  } catch (error) {
    console.error('Sync error:', error);
    setSyncStatus('error');
    emit('syncError', error);
  }
}

// Utility functions
export function resetState() {
  state.currentProject = null;
  state.currentChapter = null;
  state.currentScene = null;
  state.stats = { scenes: 0, chapters: 0, drafts: 0 };
  state.syncStatus = 'synced';
  emit('reset', state);
}

// Debug
export function debugState() {
  console.log('Current State:', state);
  return state;
}
