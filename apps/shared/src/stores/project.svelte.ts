/**
 * Project Store - Manages current project and project list (v0.2.0)
 *
 * Uses Svelte 5 runes for reactive state management
 * Communicates with backend via apiClient
 */

import type { Project } from '../types';
import { apiClient } from '../api-client';

// === State (Svelte 5 runes) ===
// Use a state object so we can export it and maintain reactivity

export const projectState = $state({
  currentProject: null as Project | null,
  projects: [] as Project[],
  isLoadingProjects: false,
  error: null as string | null,
});

// === Actions ===

/**
 * Load all projects from backend (does NOT auto-select a project)
 */
export async function loadProjects(): Promise<void> {
  projectState.isLoadingProjects = true;
  projectState.error = null;

  try {
    const list = await apiClient.listProjects();
    projectState.projects = list;

    // Do NOT auto-load current project - user must explicitly select one
    // This keeps the UI in a "no project selected" state until user chooses
  } catch (err) {
    projectState.error = err instanceof Error ? err.message : 'Failed to load projects';
    console.error('Failed to load projects:', err);
  } finally {
    projectState.isLoadingProjects = false;
  }
}

/**
 * Load current project from backend (used on app startup)
 */
export async function loadCurrentProject(): Promise<void> {
  try {
    const current = await apiClient.getCurrentProject();
    projectState.currentProject = current;
  } catch {
    // No current project or error - stay on dashboard
    console.log('No current project, showing dashboard');
    projectState.currentProject = null;
  }
}

/**
 * Switch to a different project
 */
export async function switchProject(projectId: string): Promise<void> {
  projectState.error = null;

  try {
    await apiClient.switchProject(projectId);

    // Reload current project info
    const current = await apiClient.getCurrentProject();
    projectState.currentProject = current;

    // Return and let the component handle navigation (SPA style)
    // No page reload - just reactive state update
  } catch (err) {
    projectState.error = err instanceof Error ? err.message : 'Failed to switch project';
    console.error('Failed to switch project:', err);
    throw err;
  }
}

/**
 * Create a new project
 */
export async function createNewProject(name: string): Promise<Project> {
  projectState.error = null;

  try {
    const project = await apiClient.createProject(name);

    // Add to list
    projectState.projects = [...projectState.projects, project];

    // Switch to new project
    await switchProject(project.id);

    return project;
  } catch (err) {
    projectState.error = err instanceof Error ? err.message : 'Failed to create project';
    console.error('Failed to create project:', err);
    throw err;
  }
}

/**
 * Refresh current project stats
 */
export async function refreshCurrentProject(): Promise<void> {
  projectState.error = null;

  try {
    const current = await apiClient.getCurrentProject();
    projectState.currentProject = current;
  } catch (err) {
    projectState.error = err instanceof Error ? err.message : 'Failed to refresh project';
    console.error('Failed to refresh project:', err);
  }
}

// === Helper functions ===

export function clearError() {
  projectState.error = null;
}

/**
 * Clear current project (go back to dashboard)
 */
export function clearCurrentProject() {
  projectState.currentProject = null;
}
