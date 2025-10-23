<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { db } from '@loke/shared/database';
  import type { StateVariable } from '@loke/shared';
  import { Plus, Settings } from 'lucide-svelte';

  let states: StateVariable[] = [];
  let loading = true;

  async function loadStates() {
    loading = true;
    try {
      states = await db.getAllStates();
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadStates();
  });

  // Reload data after navigation (e.g., coming back from edit page)
  afterNavigate(() => {
    loadStates();
  });

  function formatDate(timestamp?: number): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  }

  function getTypeColor(type: string): string {
    switch (type) {
      case 'number': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'boolean': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'string': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  function getScopeColor(scope: string): string {
    return scope === 'global'
      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
      : 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200';
  }
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">State Variables</h1>
    <a href="/cards/states/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
      <Plus size={20} />
      New State
    </a>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading states...</p>
    </div>
  {:else if states.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div class="flex justify-center mb-4">
        <Settings size={64} class="text-gray-400" />
      </div>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No state variables yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Create state variables to track game progress, inventory, and player stats</p>
      <a href="/cards/states/new" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
        <Plus size={20} />
        Create State
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each states as state}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {state.name}
                </h3>
                <span class="text-xs px-2 py-1 rounded {getTypeColor(state.type)}">
                  {state.type}
                </span>
                <span class="text-xs px-2 py-1 rounded {getScopeColor(state.scope)}">
                  {state.scope}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ID: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{state.id}</code>
              </p>
              {#if state.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {state.description}
                </p>
              {/if}
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Default: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{state.defaultValue}</code>
              </p>
              {#if state.scope === 'chapter' && state.chapterId}
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chapter: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{state.chapterId}</code>
                </p>
              {/if}
            </div>
            <div class="flex gap-2 ml-4">
              <a
                href={`/cards/states/edit/${state.id}`}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Edit
              </a>
              <button
                type="button"
                on:click={() => {
                  if (confirm(`Delete state variable "${state.name}"?\n\nWarning: This may break scenes that reference this state.`)) {
                    db.deleteState(state.id).then(() => {
                      states = states.filter(s => s.id !== state.id);
                    });
                  }
                }}
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(state.createdAt)}</span>
            <span>Updated: {formatDate(state.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
