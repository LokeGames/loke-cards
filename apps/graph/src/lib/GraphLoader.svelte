<script lang="ts">
  import { onMount } from 'svelte';
  import { getWorkerApi } from '@loke/worker-client';
  import type { GraphJSON } from '@schemas';
  import GraphCanvas from './GraphCanvas.svelte';

  let graphData: GraphJSON | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const api = await getWorkerApi();
      if (api && api.graph && api.graph.getProjectGraph) {
        graphData = await api.graph.getProjectGraph();
      } else {
        throw new Error('Graph API not available in worker.');
      }
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="w-full h-full flex flex-col items-center justify-center">
  {#if loading}
    <p>Loading graph...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else if graphData}
    <div class="w-full h-full">
      <GraphCanvas {graphData} />
    </div>
  {:else}
    <p>No graph data available.</p>
  {/if}
</div>
