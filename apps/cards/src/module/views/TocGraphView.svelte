<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "@loke/shared/database";
  import { TocWithGraph, mapDbToGraph, type DbLink, type DbScene, type TOCGraph } from "@loke/cards/toc-graph";

  let graph = $state<TOCGraph | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const scenes = await db.getAllScenes();

      const dbScenes: DbScene[] = scenes.map((scene, index) => ({
        id: scene.id,
        title: scene.title || scene.sceneId || `Scene ${index + 1}`,
        order: index,
      }));

      const dbLinks: DbLink[] = [];
      scenes.forEach((scene) => {
        scene.choices?.forEach((choice) => {
          if (choice.nextScene) {
            dbLinks.push({
              from_id: scene.id,
              to_id: choice.nextScene,
              tag: choice.enabled === false ? "conditional" : "choice",
            });
          }
        });
      });

      graph = mapDbToGraph(dbScenes, dbLinks);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load TOC graph data";
    } finally {
      loading = false;
    }
  });
</script>

<div class="h-full overflow-auto p-6">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">TOC Graph Visualization</h1>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      GitKraken-style visualization of scene flow with branches and merges
    </p>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading scenes and building graph...</p>
    </div>
  {:else if error}
    <div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <strong>Error:</strong> {error}
    </div>
  {:else if graph}
    {#if graph.nodes.length === 0}
      <div class="rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        No scenes found. Create some scenes first to see the graph visualization.
      </div>
    {:else}
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Rendering graph with {graph.nodes.length} nodes and {graph.edges.length} edges
        </p>
        <TocWithGraph {graph} />
      </div>
    {/if}
  {:else}
    <div class="rounded border border-orange-400 bg-orange-100 px-4 py-3 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
      Unexpected state - try reloading the page.
    </div>
  {/if}
</div>
