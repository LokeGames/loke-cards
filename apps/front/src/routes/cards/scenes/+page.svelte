<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@loke/shared';

  let scenes: Scene[] = [];
  let loading = true;

  onMount(async () => {
    try {
      scenes = await db.getAllScenes();
    } catch (error) {
      console.error('Failed to load scenes:', error);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  }
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Scenes</h1>
    <a href="/cards/scene/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
      ➕ New Scene
    </a>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading scenes...</p>
    </div>
  {:else if scenes.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <span class="text-6xl">📄</span>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No scenes yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first scene</p>
      <a href="/cards/scene/new" class="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        Create Scene
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each scenes as scene}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {scene.title || scene.sceneId}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ID: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{scene.sceneId}</code>
              </p>
              {#if scene.chapterId}
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chapter: {scene.chapterId}
                </p>
              {/if}
              {#if scene.sceneText}
                <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                  {scene.sceneText.substring(0, 150)}{scene.sceneText.length > 150 ? '...' : ''}
                </p>
              {/if}
            </div>
            <div class="flex gap-2 ml-4">
              <a
                href={`/cards/editor?id=${scene.id}`}
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                Edit
              </a>
              <button
                type="button"
                on:click={() => {
                  if (confirm(`Delete scene "${scene.title || scene.sceneId}"?`)) {
                    db.deleteScene(scene.id).then(() => {
                      scenes = scenes.filter(s => s.id !== scene.id);
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
            <span>Created: {formatDate(scene.createdAt)}</span>
            <span>Updated: {formatDate(scene.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
