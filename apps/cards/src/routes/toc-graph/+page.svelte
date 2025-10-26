<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@loke/shared/types';
  import { TocWithGraph } from '@loke/cards/toc-graph';
  import { mapDbToGraph } from '@loke/cards/toc-graph';
  import type { DbScene, DbLink } from '@loke/cards/toc-graph';
  import type { TOCGraph } from '@loke/cards/toc-graph';

  let graph: TOCGraph | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Load scenes from database
      const scenes = await db.getAllScenes();

      // Convert Scene[] to DbScene[]
      const dbScenes: DbScene[] = scenes.map((scene, index) => ({
        id: scene.id,
        title: scene.title || scene.sceneId || `Scene ${index + 1}`,
        order: index, // Use array index as order since scenes don't have explicit order
      }));

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

      // Convert to graph format
      graph = mapDbToGraph(dbScenes, dbLinks);
      loading = false;
    } catch (err) {
      console.error('Failed to load TOC graph data:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
      loading = false;
    }
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">TOC Graph Visualization</h1>

  {#if loading}
    <div class="text-gray-600">Loading scenes and building graph...</div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error:</strong> {error}
    </div>
  {:else if graph}
    {#if graph.nodes.length === 0}
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No scenes found. Create some scenes first to see the graph visualization.
      </div>
    {:else}
      <TocWithGraph graph={graph} />
    {/if}
  {/if}
</div>
