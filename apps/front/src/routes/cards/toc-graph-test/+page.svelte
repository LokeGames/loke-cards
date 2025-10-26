<script lang="ts">
  import { TocWithGraph } from '@loke/cards/toc-graph';
  import type { TOCGraph } from '@loke/cards/toc-graph';

  // Hardcoded test data
  const graph: TOCGraph = {
    nodes: [
      { id: "scene1", title: "Start", order: 0 },
      { id: "scene2", title: "Middle", order: 1 },
      { id: "scene3", title: "End", order: 2 }
    ],
    edges: [
      { from: "scene1", to: "scene2", tag: "choice" },
      { from: "scene2", to: "scene3", tag: "choice" }
    ]
  };
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold mb-4">TOC Graph Test (Hardcoded Data)</h1>
  <TocWithGraph {graph} />
</div>
