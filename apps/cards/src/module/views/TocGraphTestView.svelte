<script lang="ts">
  import { TocWithGraph, type TOCGraph } from "@loke/cards/toc-graph";

  const graph: TOCGraph = {
    nodes: [
      { id: "scene1", title: "Start", order: 0 },
      { id: "scene2", title: "Middle", order: 1 },
      { id: "scene3", title: "End", order: 2 },
    ],
    edges: [
      { from: "scene1", to: "scene2", tag: "choice" },
      { from: "scene2", to: "scene3", tag: "choice" },
    ],
  };
</script>

<div class="h-full overflow-auto p-6">
  <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">TOC Graph Test (Hardcoded Data)</h1>
  <TocWithGraph {graph} />
</div>
