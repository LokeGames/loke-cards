<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import type { GraphJSON } from '@schemas';

  export let projectId: string | undefined;
  export let chapterId: string | undefined;
  let graph: GraphJSON = { projectId, nodes: [], edges: [] };
  let error = '';

  onMount(async () => {
    try {
      const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
      worker.port.start();
      const api = Comlink.wrap<{ graph: { getProjectGraph(id?: string): Promise<GraphJSON>; getChapterGraph(id: string, pid?: string): Promise<GraphJSON> } }>(worker.port);
      graph = chapterId ? await api.graph.getChapterGraph(chapterId, projectId) : await api.graph.getProjectGraph(projectId);
    } catch (e) {
      error = 'failed';
    }
  });
</script>

{#if error}
  <p data-testid="graph-error">{error}</p>
{:else}
  <div>
    <p data-testid="graph-nodes">{graph.nodes.length}</p>
    <p data-testid="graph-edges">{graph.edges.length}</p>
  </div>
{/if}
