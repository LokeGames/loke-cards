<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Chapter } from '@loke/shared';

  let chapters: Chapter[] = [];
  let loading = true;

  onMount(async () => {
    try {
      chapters = await db.getAllChapters();
    } catch (error) {
      console.error('Failed to load chapters:', error);
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
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Chapters</h1>
    <a href="/cards/chapter/new" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
      ➕ New Chapter
    </a>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading chapters...</p>
    </div>
  {:else if chapters.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <span class="text-6xl">📚</span>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No chapters yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first chapter</p>
      <a href="/cards/chapter/new" class="mt-4 inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
        Create Chapter
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each chapters as chapter}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {chapter.title || chapter.chapterId}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ID: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{chapter.chapterId}</code>
              </p>
              {#if chapter.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {chapter.description}
                </p>
              {/if}
            </div>
            <div class="flex gap-2 ml-4">
              <a
                href={`/cards/chapter/edit?id=${chapter.id}`}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Edit
              </a>
              <button
                type="button"
                on:click={() => {
                  if (confirm(`Delete chapter "${chapter.name || chapter.title || chapter.id}"?`)) {
                    db.deleteChapter(chapter.id).then(() => {
                      chapters = chapters.filter(c => c.id !== chapter.id);
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
            <span>Created: {formatDate(chapter.createdAt)}</span>
            <span>Updated: {formatDate(chapter.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
