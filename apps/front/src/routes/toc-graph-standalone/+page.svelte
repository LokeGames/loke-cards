<script lang="ts">
  import { onMount } from 'svelte';
  import { TocWithGraph } from '@loke/cards/toc-graph';
  import { mapDbToGraph } from '@loke/cards/toc-graph';
  import type { DbScene, DbLink, TOCGraph } from '@loke/cards/toc-graph';

  let graph = $state<TOCGraph | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      console.log('[TOC Graph Standalone] Fetching scenes...');

      // Fetch scenes directly from API with project header
      const response = await fetch('http://localhost:3000/api/scenes', {
        headers: {
          'X-Project-ID': 'horror-story'
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const rawScenes = await response.json();
      console.log('[TOC Graph Standalone] Raw scenes:', rawScenes);

      // Parse scenes from API format
      const scenes = rawScenes.map((item: any) => {
        const parsed = JSON.parse(item.data);
        return {
          id: item.id,
          ...parsed
        };
      });

      console.log('[TOC Graph Standalone] Parsed scenes:', scenes);

      // Convert to DbScene format
      const dbScenes: DbScene[] = scenes.map((scene: any, index: number) => ({
        id: scene.id || scene.sceneId,
        title: scene.title || scene.sceneId || `Scene ${index + 1}`,
        order: index,
      }));

      console.log('[TOC Graph Standalone] DbScenes:', dbScenes);

      // Extract links from choices
      const dbLinks: DbLink[] = [];
      scenes.forEach((scene: any) => {
        if (scene.choices && scene.choices.length > 0) {
          scene.choices.forEach((choice: any) => {
            if (choice.nextScene) {
              dbLinks.push({
                from_id: scene.id || scene.sceneId,
                to_id: choice.nextScene,
                tag: choice.enabled === false ? 'conditional' : 'choice',
              });
            }
          });
        }
      });

      console.log('[TOC Graph Standalone] Links:', dbLinks);

      // Create graph
      graph = mapDbToGraph(dbScenes, dbLinks);
      console.log('[TOC Graph Standalone] Graph:', graph);

      loading = false;
    } catch (err) {
      console.error('[TOC Graph Standalone] Error:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
      loading = false;
    }
  });
</script>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TOC Graph - Standalone</title>
</head>
<body class="bg-gray-50 dark:bg-gray-900 min-h-screen">
  <div class="container mx-auto p-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">TOC Graph Visualization</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mt-2">
        GitKraken-style visualization of scene flow - Standalone version
      </p>
      <p class="text-sm text-blue-600 dark:text-blue-400 mt-1">
        Project: horror-story
      </p>
    </div>

    {#if loading}
      <div class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p class="mt-6 text-xl text-gray-600 dark:text-gray-400">Loading scenes...</p>
      </div>
    {:else if error}
      <div class="bg-red-100 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg">
        <h2 class="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    {:else if graph}
      {#if graph.nodes.length === 0}
        <div class="bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-6 py-4 rounded-lg">
          <h2 class="text-xl font-bold mb-2">No Data</h2>
          <p>No scenes found in the database.</p>
        </div>
      {:else}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="mb-4 text-sm text-gray-500">
            Graph: {graph.nodes.length} scenes, {graph.edges.length} connections
          </div>
          <TocWithGraph {graph} />
        </div>
      {/if}
    {/if}
  </div>
</body>
</html>
