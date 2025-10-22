<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene, Chapter } from '@loke/shared';

  let chapters: Chapter[] = [];
  let scenes: Scene[] = [];
  let loading = true;

  // Group scenes by chapter
  $: scenesByChapter = scenes.reduce((acc, scene) => {
    const chapterId = scene.chapterId || 'uncategorized';
    if (!acc[chapterId]) {
      acc[chapterId] = [];
    }
    acc[chapterId].push(scene);
    return acc;
  }, {} as Record<string, Scene[]>);

  onMount(async () => {
    try {
      [chapters, scenes] = await Promise.all([
        db.getAllChapters(),
        db.getAllScenes(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Table of Contents</h1>
    <div class="flex gap-2">
      <a href="/cards/chapter/new" class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
        ➕ Chapter
      </a>
      <a href="/cards/scene/new" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
        ➕ Scene
      </a>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading project structure...</p>
    </div>
  {:else if chapters.length === 0 && scenes.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <span class="text-6xl">📋</span>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No content yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Start by creating chapters and scenes</p>
    </div>
  {:else}
    <div class="space-y-6">
      <!-- Chapters with their scenes -->
      {#each chapters as chapter}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Chapter Header -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  📚 {chapter.title}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {chapter.chapterId}
                </p>
                {#if chapter.description}
                  <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {chapter.description}
                  </p>
                {/if}
              </div>
              <a
                href={`/cards/chapter/edit?id=${chapter.id}`}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Edit
              </a>
            </div>
          </div>

          <!-- Scenes in this chapter -->
          <div class="p-4">
            {#if scenesByChapter[chapter.chapterId]?.length > 0}
              <div class="space-y-2">
                {#each scenesByChapter[chapter.chapterId] as scene, idx}
                  <a
                    href={`/cards/editor?id=${scene.id}`}
                    class="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex items-start gap-3">
                        <span class="text-gray-500 dark:text-gray-400 font-mono text-sm">
                          {idx + 1}.
                        </span>
                        <div>
                          <h3 class="font-medium text-gray-900 dark:text-white">
                            📄 {scene.title || scene.sceneId}
                          </h3>
                          {#if scene.sceneText}
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                              {scene.sceneText.substring(0, 100)}...
                            </p>
                          {/if}
                        </div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {scene.sceneId}
                      </span>
                    </div>
                  </a>
                {/each}
              </div>
            {:else}
              <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No scenes in this chapter yet
              </p>
            {/if}
          </div>
        </div>
      {/each}

      <!-- Uncategorized scenes -->
      {#if scenesByChapter.uncategorized?.length > 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 border-b border-yellow-200 dark:border-yellow-800">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              ⚠️ Uncategorized Scenes
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              These scenes are not assigned to any chapter
            </p>
          </div>
          <div class="p-4 space-y-2">
            {#each scenesByChapter.uncategorized as scene}
              <a
                href={`/cards/editor?id=${scene.id}`}
                class="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <h3 class="font-medium text-gray-900 dark:text-white">
                  📄 {scene.title || scene.sceneId}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{scene.sceneId}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
