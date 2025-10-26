<script lang="ts">
  import TocGraph from "./TocGraph.svelte";
  import type { TOCGraph } from "./types";

  // Props
  let { graph }: { graph: TOCGraph } = $props();
</script>

<div class="grid grid-cols-12 gap-6">
  <!-- TOC List (Left Column) -->
  <aside class="col-span-5 xl:col-span-4">
    <h2 class="text-xl font-semibold mb-3">Table of Contents</h2>
    <ol class="space-y-2">
      {#each [...graph.nodes].sort((a, b) => a.order - b.order) as n}
        <li class="rounded border bg-base-100/60 px-3 py-2">
          <div class="font-mono text-sm">{n.title}</div>
          <div class="text-xs text-slate-500">id: {n.id}</div>
        </li>
      {/each}
    </ol>
  </aside>

  <!-- Graph Visualization (Right Column) -->
  <section class="col-span-7 xl:col-span-8 min-h-[420px]">
    <div class="h-full rounded border bg-base-200/40 p-3">
      <TocGraph {graph} />
    </div>
  </section>
</div>
