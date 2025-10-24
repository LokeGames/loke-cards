<script lang="ts">
  import { onMount } from 'svelte';
  import type { Project } from '@loke/shared/types';
  import {
    loadProjects,
    switchProject,
    createNewProject,
    getCurrentProject,
    getProjects,
    getIsLoadingProjects,
    getError,
    clearError
  } from '@loke/shared/stores/project.svelte';

  // State
  let isOpen = $state(false);
  let searchQuery = $state('');
  let isCreating = $state(false);
  let newProjectName = $state('');
  let isProcessing = $state(false);

  // Reactive getters from store (Svelte 5 runes)
  let currentProject = $derived(getCurrentProject());
  let projects = $derived(getProjects());
  let isLoadingProjects = $derived(getIsLoadingProjects());
  let error = $derived(getError());

  // Filtered projects based on search
  let filteredProjects = $derived(
    projects.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  onMount(() => {
    loadProjects();
  });

  async function handleSwitch(projectId: string) {
    if (projectId === currentProject?.id) {
      isOpen = false;
      return;
    }

    isProcessing = true;
    try {
      await switchProject(projectId);
      isOpen = false;
    } catch (err) {
      // Error handled in store
      console.error('Failed to switch project:', err);
    } finally {
      isProcessing = false;
    }
  }

  async function handleCreate() {
    if (!newProjectName.trim()) return;

    isProcessing = true;
    try {
      await createNewProject(newProjectName);
      newProjectName = '';
      isCreating = false;
      isOpen = false;
    } catch (err) {
      // Error handled in store
      console.error('Failed to create project:', err);
    } finally {
      isProcessing = false;
    }
  }

  function toggleDropdown() {
    isOpen = !isOpen;
    if (!isOpen) {
      searchQuery = '';
      isCreating = false;
      newProjectName = '';
      clearError();
    }
  }

  function closeDropdown() {
    isOpen = false;
    searchQuery = '';
    isCreating = false;
    newProjectName = '';
    clearError();
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isOpen && !target.closest('.project-picker')) {
      closeDropdown();
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="project-picker relative">
  <!-- Trigger Button -->
  <button
    type="button"
    class="picker-trigger inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md
           bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600
           hover:bg-gray-200 dark:hover:bg-gray-700
           focus:outline-none focus:ring-2 focus:ring-blue-500
           transition-colors duration-150"
    onclick={toggleDropdown}
    disabled={isLoadingProjects || isProcessing}
  >
    <span class="project-icon">📁</span>
    <span class="project-name text-gray-900 dark:text-gray-100">
      {#if isLoadingProjects}
        Loading...
      {:else if currentProject}
        {currentProject.name}
      {:else}
        Select Project
      {/if}
    </span>
    <span class="chevron text-gray-500 dark:text-gray-400">▾</span>
  </button>

  <!-- Dropdown Menu -->
  {#if isOpen}
    <div class="picker-dropdown absolute top-full left-0 mt-1 min-w-64 max-w-sm
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                rounded-lg shadow-lg z-50">

      <!-- Search Input -->
      <div class="p-2 border-b border-gray-200 dark:border-gray-700">
        <input
          type="search"
          bind:value={searchQuery}
          placeholder="Search projects..."
          class="w-full px-3 py-2 text-sm rounded-md
                 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600
                 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Projects List -->
      <div class="projects-list max-h-80 overflow-y-auto">
        {#if isLoadingProjects}
          <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading projects...
          </div>
        {:else if filteredProjects.length === 0}
          <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </div>
        {:else}
          {#each filteredProjects as project}
            <button
              type="button"
              class="project-item w-full flex items-center justify-between px-4 py-3
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     {currentProject?.id === project.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                     border-b border-gray-100 dark:border-gray-700 last:border-b-0
                     transition-colors duration-150"
              onclick={() => handleSwitch(project.id)}
              disabled={isProcessing}
            >
              <div class="flex flex-col items-start gap-1">
                <span class="font-medium text-gray-900 dark:text-gray-100">
                  {project.name}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {project.sceneCount} scenes · {project.chapterCount} chapters
                </span>
              </div>
              {#if currentProject?.id === project.id}
                <span class="text-blue-500 dark:text-blue-400">✓</span>
              {/if}
            </button>
          {/each}
        {/if}
      </div>

      <!-- Create New Project Form -->
      {#if isCreating}
        <div class="create-form p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div class="flex flex-col gap-2">
            <input
              type="text"
              bind:value={newProjectName}
              placeholder="Project name..."
              class="px-3 py-2 text-sm rounded-md
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <div class="flex gap-2">
              <button
                type="button"
                onclick={handleCreate}
                disabled={!newProjectName.trim() || isProcessing}
                class="flex-1 px-3 py-2 text-sm font-medium rounded-md
                       bg-blue-500 hover:bg-blue-600 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-150"
              >
                {isProcessing ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onclick={() => { isCreating = false; newProjectName = ''; }}
                disabled={isProcessing}
                class="px-3 py-2 text-sm font-medium rounded-md
                       bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      {:else}
        <button
          type="button"
          class="create-button w-full px-4 py-3 text-sm font-medium text-left
                 border-t border-gray-200 dark:border-gray-700
                 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700
                 text-gray-700 dark:text-gray-300
                 transition-colors duration-150"
          onclick={() => { isCreating = true; }}
          disabled={isProcessing}
        >
          ➕ Create New Project
        </button>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          {error}
        </div>
      {/if}
    </div>
  {/if}
</div>
