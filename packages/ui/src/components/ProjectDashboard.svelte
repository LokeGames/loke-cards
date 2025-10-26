<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Folder from '../icons/Folder.svelte';
  import type { Project } from '@loke/shared/types';
  import {
    projectState,
    loadProjects,
    switchProject,
    createNewProject,
    clearError
  } from '@loke/shared/stores/project.svelte';

  // State
  let isCreatingProject = $state(false);
  let newProjectName = $state('');
  let isProcessing = $state(false);

  // Recent projects (last 4, sorted by... we'll need updated_at later)
  let recentProjects = $derived(projectState.projects.slice(0, 4));
  let allProjects = $derived(projectState.projects);

  // Load projects on mount if not already loaded
  onMount(async () => {
    if (projectState.projects.length === 0 && !projectState.isLoadingProjects) {
      await loadProjects();
    }
  });

  async function handleOpenProject(projectId: string) {
    isProcessing = true;
    try {
      await switchProject(projectId);
      // Navigate to cards view after selecting project
      goto('/cards');
    } catch (err) {
      console.error('Failed to open project:', err);
    } finally {
      isProcessing = false;
    }
  }

  async function handleCreateProject() {
    if (!newProjectName.trim()) return;

    isProcessing = true;
    try {
      await createNewProject(newProjectName);
      newProjectName = '';
      isCreatingProject = false;
      // Navigate to cards view after creating project
      goto('/cards');
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="project-dashboard mx-auto p-8">
  <div class="max-w-4xl w-full">
    <!-- Welcome Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Welcome to Loke Cards
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Interactive Fiction Editor
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <!-- New Project Card -->
      <button
        type="button"
        onclick={() => { isCreatingProject = true; clearError(); }}
        disabled={isProcessing}
        class="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl
               hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20
               transition-all duration-200 text-left group"
      >
        <div class="flex items-start gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              New Project
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Create a fresh interactive fiction project from scratch
            </p>
          </div>
        </div>
      </button>

      <!-- Browse Projects Card -->
      <div class="p-8 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-start gap-4">
          <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Folder class="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Browse Projects
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {projectState.projects.length} project{projectState.projects.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    {#if projectState.isLoadingProjects}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>
    {:else}
      <!-- Recent Projects -->
      {#if recentProjects.length > 0}
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Recent Projects
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each recentProjects as project}
              <button
                type="button"
                onclick={() => handleOpenProject(project.id)}
                disabled={isProcessing}
                class="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       rounded-lg hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400
                       transition-all duration-200 text-left"
              >
                <div class="flex items-center gap-3 mb-3">
                  <Folder class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {project.name}
                  </h3>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{project.sceneCount} scene{project.sceneCount !== 1 ? 's' : ''}</p>
                  <p>{project.chapterCount} chapter{project.chapterCount !== 1 ? 's' : ''}</p>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- All Projects List -->
      {#if allProjects.length > 0}
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            All Projects
          </h2>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {#each allProjects as project}
              <button
                type="button"
                onclick={() => handleOpenProject(project.id)}
                disabled={isProcessing}
                class="w-full p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <Folder class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                      {project.name}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {project.sceneCount} scenes · {project.chapterCount} chapters
                    </p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            {/each}
          </div>
        </div>
      {:else if !projectState.isLoadingProjects}
        <div class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
          <p class="text-gray-500 dark:text-gray-500">Create your first project to get started</p>
        </div>
      {/if}
    {/if}

    <!-- Error Display -->
    {#if projectState.error}
      <div class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400">{projectState.error}</p>
      </div>
    {/if}
  </div>
</div>

<!-- Create Project Modal -->
{#if isCreatingProject}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Create New Project
      </h2>

      <div class="mb-6">
        <label for="project-name-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Name
        </label>
        <input
          id="project-name-input"
          type="text"
          bind:value={newProjectName}
          placeholder="My Interactive Story"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isProcessing}
          onkeydown={(e) => { if (e.key === 'Enter') handleCreateProject(); }}
        />
      </div>

      {#if projectState.error}
        <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{projectState.error}</p>
        </div>
      {/if}

      <div class="flex gap-3">
        <button
          type="button"
          onclick={handleCreateProject}
          disabled={!newProjectName.trim() || isProcessing}
          class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Creating...' : 'Create Project'}
        </button>
        <button
          type="button"
          onclick={() => { isCreatingProject = false; newProjectName = ''; clearError(); }}
          disabled={isProcessing}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                 text-gray-700 dark:text-gray-300 font-medium rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
