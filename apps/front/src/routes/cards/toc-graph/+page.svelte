<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@loke/shared/types';
  import { TocWithGraph } from '@loke/cards/toc-graph';
  import { mapDbToGraph } from '@loke/cards/toc-graph';
  import type { DbScene, DbLink, TOCGraph } from '@loke/cards/toc-graph';

  let graph = $state<TOCGraph | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      console.log('[TOC Graph] Starting to load scenes...');

      // Load scenes from database
      const scenes = await db.getAllScenes();
      console.log(`[TOC Graph] Loaded ${scenes.length} scenes from database`);

      // Convert Scene[] to DbScene[]
      const dbScenes: DbScene[] = scenes.map((scene, index) => ({
        id: scene.id,
        title: scene.title || scene.sceneId || `Scene ${index + 1}`,
        order: index, // Use array index as order since scenes don't have explicit order
      }));
      console.log(`[TOC Graph] Converted to ${dbScenes.length} DbScenes`);

      // Extract links from Scene.choices to DbLink[]
      const dbLinks: DbLink[] = [];
      scenes.forEach((scene) => {
        if (scene.choices && scene.choices.length > 0) {
          scene.choices.forEach((choice) => {
            if (choice.nextScene) {
              dbLinks.push({
                from_id: scene.id,
                to_id: choice.nextScene,
                tag: choice.enabled === false ? 'conditional' : 'choice',
              });
            }
          });
        }
      });
      console.log(`[TOC Graph] Extracted ${dbLinks.length} links from choices`);

      // Convert to graph format
      graph = mapDbToGraph(dbScenes, dbLinks);
      console.log('[TOC Graph] Graph created:', graph);
      console.log('[TOC Graph] Graph has', graph.nodes.length, 'nodes and', graph.edges.length, 'edges');
      loading = false;
      console.log('[TOC Graph] Loading set to false, should render now');
    } catch (err) {
      console.error('[TOC Graph] Failed to load TOC graph data:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
      loading = false;
    }
  });
</script>

<div class="p-6">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">TOC Graph Visualization</h1>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
      GitKraken-style visualization of scene flow with branches and merges
    </p>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading scenes and building graph...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
      <strong>Error:</strong> {error}
    </div>
  {:else if graph}
    {#if graph.nodes.length === 0}
      <div class="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
        No scenes found. Create some scenes first to see the graph visualization.
      </div>
    {:else}
      <div>
        <p class="text-sm text-gray-500 mb-4">Debug: Rendering graph with {graph.nodes.length} nodes and {graph.edges.length} edges</p>
        <TocWithGraph {graph} />
      </div>
    {/if}
  {:else}
    <div class="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded">
      <strong>Debug:</strong> Unexpected state - loading={loading}, error={error}, graph={graph}
    </div>
  {/if}
</div>
