/**
 * Project Store - Manages current project and project list (v0.2.0)
 *
 * Uses Svelte 5 runes for reactive state management
 * Communicates with backend via apiClient
 */

import type { Project } from '../types';
import { apiClient } from '../api-client';

// === State (Svelte 5 runes) ===

let currentProject = $state<Project | null>(null);
let projects = $state<Project[]>([]);
let isLoadingProjects = $state<boolean>(false);
let error = $state<string | null>(null);

// === Actions ===

/**
 * Load all projects from backend (does NOT auto-select a project)
 */
export async function loadProjects(): Promise<void> {
  isLoadingProjects = true;
  error = null;

  try {
    const list = await apiClient.listProjects();
    projects = list;

    // Do NOT auto-load current project - user must explicitly select one
    // This keeps the UI in a "no project selected" state until user chooses
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects';
    console.error('Failed to load projects:', err);
  } finally {
    isLoadingProjects = false;
  }
}

/**
 * Switch to a different project
 */
export async function switchProject(projectId: string): Promise<void> {
  error = null;

  try {
    await apiClient.switchProject(projectId);

    // Reload current project info
    const current = await apiClient.getCurrentProject();
    currentProject = current;

    // Trigger page reload to refresh data
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to switch project';
    console.error('Failed to switch project:', err);
    throw err;
  }
}

/**
 * Create a new project
 */
export async function createNewProject(name: string): Promise<Project> {
  error = null;

  try {
    const project = await apiClient.createProject(name);

    // Add to list
    projects = [...projects, project];

    // Switch to new project
    await switchProject(project.id);

    return project;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to create project';
    console.error('Failed to create project:', err);
    throw err;
  }
}

/**
 * Refresh current project stats
 */
export async function refreshCurrentProject(): Promise<void> {
  error = null;

  try {
    const current = await apiClient.getCurrentProject();
    currentProject = current;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to refresh project';
    console.error('Failed to refresh project:', err);
  }
}

// === Getters (expose reactive state) ===

export function getCurrentProject() {
  return currentProject;
}

export function getProjects() {
  return projects;
}

export function getIsLoadingProjects() {
  return isLoadingProjects;
}

export function getError() {
  return error;
}

export function clearError() {
  error = null;
}
