<script lang="ts">
  import { onMount } from 'svelte';
  import type { GraphJSON } from '@schemas';
  import { SCENE_NODE_TYPE, CHAPTER_NODE_TYPE } from '../nodes/register';
  export let width = 800;
  export let height = 600;
  export let autoInit: boolean = true;
  export let graph: GraphJSON | null = null;
  let el: HTMLCanvasElement | null = null;
  let initialized = false;
  let nodesCount = 0;
  let edgesCount = 0;
  let nodeMap: Map<string, any> | null = null;
  
  onMount(async () => {
    if (!autoInit) return;
    try {
      // Dynamic import to allow mocking in tests and avoid SSR issues
      const mod: any = await import('litegraph.js');
      if (mod && el) {
        const LGraph = mod.LGraph || mod.LiteGraph?.LGraph;
        const LGraphCanvas = mod.LGraphCanvas || mod.LiteGraph?.LGraphCanvas;
        const graph = LGraph ? new LGraph() : null;
        if (LGraphCanvas && graph) {
          const canvas = new LGraphCanvas(el, graph);
          // basic init: fit view
          if (canvas?.ds) {
            canvas.ds.offset = [0, 0];
            canvas.ds.scale = 1;
          }
        }
        initialized = true;
      }
    } catch {
      // ignore init failures in non-DOM test envs
    }
  });

  $: (async () => {
    if (!graph || !el) return;
    try {
      const mod: any = await import('litegraph.js');
      const LGraph = mod.LGraph || mod.LiteGraph?.LGraph;
      const LGraphCanvas = mod.LGraphCanvas || mod.LiteGraph?.LGraphCanvas;
      const LiteGraph = mod.LiteGraph || mod;
      if (!LGraph || !LGraphCanvas) return;
      const g = new LGraph();
      const canvas = new LGraphCanvas(el, g);
      const map = new Map<string, any>();
      nodesCount = graph.nodes.length;
      edgesCount = graph.edges.length;
      for (const n of graph.nodes) {
        const type = n.type === 'scene' ? SCENE_NODE_TYPE : n.type === 'chapter' ? CHAPTER_NODE_TYPE : null;
        const node = type ? LiteGraph.createNode(type) : new LiteGraph.LGraphNode();
        node.title = n.label;
        if (n.position) node.pos = [n.position.x, n.position.y];
        if (!node.inputs?.length) node.addInput('in', LiteGraph.ACTION || 0);
        if (!node.outputs?.length) node.addOutput('out', LiteGraph.EVENT || 0);
        g.add(node);
        map.set(n.id, node);
      }
      for (const e of graph.edges) {
        const s = map.get(e.source);
        const t = map.get(e.target);
        if (s && t && s.connect) s.connect(0, t, 0);
      }
      if (canvas?.ds) {
        canvas.ds.offset = [0, 0];
        canvas.ds.scale = 1;
      }
      nodeMap = map;
      // Persist positions on mouseup (drag-stop)
      el.addEventListener('mouseup', () => {
        if (!nodeMap) return;
        const payload = Array.from(nodeMap.entries()).map(([id, node]) => ({ id, x: node.pos?.[0] ?? 0, y: node.pos?.[1] ?? 0 }));
        const ev = new CustomEvent('node-move', { detail: { nodes: payload } });
        el.dispatchEvent(ev);
      });
    } catch {
      // swallow in tests/SSR
    }
  })();
</script>

<div class="grid-bg inline-block">
  <canvas bind:this={el} width={width} height={height} data-testid="graph-canvas" data-initialized={initialized} data-nodes={nodesCount} data-edges={edgesCount} />
  
</div>

<style>
  .grid-bg {
    background-image:
      linear-gradient(#222 1px, transparent 1px),
      linear-gradient(90deg, #222 1px, transparent 1px);
    background-size: 20px 20px;
    background-color: #111;
    padding: 4px;
  }
</style>
