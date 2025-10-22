<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import type { Chapter, Scene } from '@schemas';

  type DataApi = {
    chapters: { list(): Promise<Chapter[]> };
    cards: { list(): Promise<Scene[]> };
  };

  let chaptersCount = 0;
  let scenesCount = 0;
  let loading = true;

  onMount(async () => {
    try {
      const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
      worker.port.start();
      const api = Comlink.wrap<DataApi>(worker.port);
      
      const [chapters, scenes] = await Promise.all([
        api.chapters.list(),
        api.cards.list()
      ]);
      
      chaptersCount = chapters.length;
      scenesCount = scenes.length;
    } catch (error) {
      console.error('Failed to load project stats:', error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Stats</h2>
  
  {#if loading}
    <div class="space-y-3">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{chaptersCount}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{scenesCount}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Scenes</div>
      </div>
    </div>
  {/if}
</div>