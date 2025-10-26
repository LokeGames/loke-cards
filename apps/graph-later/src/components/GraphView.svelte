<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import GraphCanvas from '../lib/GraphCanvas.svelte';
  import type { GraphJSON } from '@schemas';
  import { registerNodes } from '../nodes/register';
  let graph: GraphJSON | null = null;
  export let projectId: string | undefined;
  export let chapterId: string | undefined;
  let error = '';
  let api: any;

  onMount(async () => {
    try {
      const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
      worker.port.start();
      const mod: any = await import('litegraph.js');
      registerNodes(mod.LiteGraph || mod);
      api = Comlink.wrap<{ graph: { getProjectGraph(id?: string): Promise<GraphJSON>; getChapterGraph(id: string, pid?: string): Promise<GraphJSON>; setNodePosition(nodeId: string, x: number, y: number): Promise<boolean> } }>(worker.port);
      graph = chapterId ? await api.graph.getChapterGraph(chapterId, projectId) : await api.graph.getProjectGraph(projectId);
    } catch (e) {
      error = 'failed';
    }
  });

  async function onMove(e: CustomEvent<{ nodes: Array<{ id: string; x: number; y: number }> }>) {
    try {
      for (const n of e.detail.nodes) {
        await api.graph.setNodePosition(n.id, n.x, n.y);
      }
    } catch {}
  }
</script>

{#if error}
  <p data-testid="graphview-error">{error}</p>
{:else if graph}
  <GraphCanvas {graph} width={900} height={600} on:node-move={onMove} />
{:else}
  <p>Loading…</p>
{/if}
