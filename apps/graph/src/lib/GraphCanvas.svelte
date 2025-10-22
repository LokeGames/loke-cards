<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { GraphJSON } from '@schemas';
  import { getWorkerApi } from '@loke/worker-client';

  let canvas: HTMLCanvasElement;
  let graph: any; // LiteGraph.LGraph
  let graphCanvas: any; // LiteGraph.LGraphCanvas
  let workerApi: any; // Comlink.Remote<API>

  onMount(async () => {
    const LiteGraph = await import('litegraph.js');
    workerApi = await getWorkerApi();

    graph = new LiteGraph.LGraph();
    graphCanvas = new LiteGraph.LGraphCanvas(canvas, graph);

    graphCanvas.background_image = null;
    graphCanvas.set_canvas_background_color("#222");

    // Populate graph with initial data from window.initialGraphData if available
    const initialGraphData: GraphJSON = (window as any).initialGraphData || { nodes: [], edges: [] };

    if (initialGraphData && initialGraphData.nodes) {
      initialGraphData.nodes.forEach(nodeData => {
        const node = LiteGraph.createNode(nodeData.type);
        if (node) {
          node.title = nodeData.label || nodeData.id;
          if (nodeData.pos) {
            node.pos = [nodeData.pos.x, nodeData.pos.y];
          }
          graph.add(node);
        }
      });
    }

    graph.onNodeMoved = async (node: any) => {
      if (workerApi && workerApi.graph && workerApi.graph.updateNodePosition) {
        await workerApi.graph.updateNodePosition(node.id, { x: node.pos[0], y: node.pos[1] });
      }
    };

    // TODO: Add edges once nodes are properly added and LiteGraph.js edge handling is clear

    graph.start();
  });

  onDestroy(() => {
    if (graph) {
      graph.stop();
    }
  });
</script>

<div class="w-full h-full relative">
  <canvas bind:this={canvas} class="block w-full h-full" data-testid="graph-canvas"></canvas>
</div>

<style>
  /* Optional: Add any specific styling for the canvas or its container */
</style>