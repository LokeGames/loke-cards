<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { db } from '@loke/shared/database';
  import type { Chapter } from '@schemas';

  let chapters: Chapter[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const allChapters = await db.getAllChapters();
      // Sort by updatedAt descending to get most recent first
      chapters = allChapters
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, 5); // Show only 5 most recent
    } catch (error) {
      console.error('Failed to load recent chapters:', error);
    } finally {
      loading = false;
    }
  });

  function goToChapter(chapter: Chapter) {
    goto(`/cards/chapters/edit/${chapter.id}`);
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Chapters</h2>
    <button
      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      on:click={() => goto('/cards/chapters')}
    >
      View All
    </button>
  </div>

  {#if loading}
    <div class="space-y-3">
      {#each Array(3) as _}
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      {/each}
    </div>
  {:else if chapters.length === 0}
    <p class="text-sm text-gray-600 dark:text-gray-400">No chapters created yet.</p>
  {:else}
    <div class="space-y-3">
      {#each chapters as chapter}
        <button
          type="button"
          class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-left"
          on:click={() => goToChapter(chapter)}
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 dark:text-white truncate">{chapter.name || chapter.title || chapter.id}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">ID: {chapter.id}</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {formatDate(chapter.updatedAt || chapter.createdAt)}
            </div>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>