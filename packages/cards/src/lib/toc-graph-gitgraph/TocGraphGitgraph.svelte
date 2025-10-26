<script lang="ts">
  import { onDestroy, onMount, afterUpdate } from "svelte";
  import {
    createGitgraph,
    Orientation,
    templateExtend,
    type GitgraphUserApi,
  } from "@gitgraph/js";
  import {
    mapTocToGitgraph,
    type GraphSceneLink,
    type GraphSceneNode,
  } from "./mapTocToGitgraph";

  const DEFAULT_COLORS = [
    "#60a5fa",
    "#22d3ee",
    "#a78bfa",
    "#34d399",
    "#f472b6",
    "#f59e0b",
    "#ef4444",
  ];

  export let nodes: GraphSceneNode[] = [];
  export let links: GraphSceneLink[] = [];
  export let rowHeight = 64;
  export let colors = DEFAULT_COLORS;

  let gitgraph: GitgraphUserApi<SVGElement> | null = null;
  let container: HTMLDivElement | null = null;
  let signature = "";

  function getTemplate() {
    return templateExtend("metro", {
      colors,
      branch: {
        label: {
          display: false,
        },
        spacing: 42,
        lineWidth: 3,
      },
      commit: {
        spacing: rowHeight,
        dot: {
          size: 12,
          strokeWidth: 2,
          strokeColor: "#0f172a",
        },
        message: {
          display: false,
        },
      },
    });
  }

  function computeSignature(): string {
    const key = {
      nodes: nodes.map((node) => ({
        id: node.id,
        order: node.order,
        title: node.title,
        lane: node.lane ?? null,
      })),
      links: links.map((link) => ({
        from: link.from,
        to: link.to,
        tag: link.tag,
      })),
      rowHeight,
    };

    return JSON.stringify(key);
  }

  function ensureGitgraph() {
    if (!container) return;
    if (!gitgraph) {
      gitgraph = createGitgraph(container, {
        orientation: Orientation.Vertical,
        template: getTemplate(),
        responsive: true,
      });
      return;
    }

    gitgraph.clear();
  }

  function renderGraph() {
    if (!container) return;
    ensureGitgraph();
    if (!gitgraph) return;

    mapTocToGitgraph(gitgraph, nodes, links, { colors });
  }

  onMount(() => {
    signature = computeSignature();
    renderGraph();
  });

  afterUpdate(() => {
    const nextSignature = computeSignature();
    if (nextSignature === signature) {
      return;
    }
    signature = nextSignature;
    renderGraph();
  });

  onDestroy(() => {
    gitgraph?.clear();
    gitgraph = null;
  });
</script>

<div class="relative h-full w-full overflow-hidden">
  <div bind:this={container} class="h-full w-full"></div>
</div>
