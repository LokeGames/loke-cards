# LokeCards: GitKraken‑style TOC Graph – Build Guide (Svelte+TS+Tailwind+SVG)
se [kraken-graph](./kraken-graph.png)

> **Audience:** AI coder agents (Claude‑Code, GPT, Qwen‑Coder).
> **Goal:** Render a GitKraken‑style lane/commit graph **next to** the existing TOC list to visualize scene flow (branches/merges/choices) for text adventures.

---

## 0) Deliverables

* `packages/cards/src/lib/toc-graph/` module with:

  * `types.ts` – shared graph types
  * `TocGraph.svelte` – pure SVG renderer (GitKraken style)
  * `TocWithGraph.svelte` – two‑column layout: TOC left, graph right
  * `usePanZoom.ts` – optional utility for SVG pan/zoom via viewBox
* Minimal demo page/route: `/cards/toc` showing real project data
* Unit & UI tests: lane layout, resize stability, click/hover events
* Docs in this file; CHANGELOG and TEST‑PROOF checklist filled

---

## 1) Tech & Constraints

* **Framework:** Svelte + TypeScript + Tailwind
* **Render target:** **SVG** (not Canvas) — crisp, easy to style, responsive
* **Scale:** ~1–1.5k nodes acceptable; keep O(N log N) layout
* **No heavy graph libs** (D3/ELK/etc.). Custom, deterministic layout

---

## 2) Data Model (shared)

Create `packages/cards/src/lib/toc-graph/types.ts`:

```ts
export type SceneId = string;

export interface SceneNode {
  id: SceneId;
  title: string;
  order: number;     // global TOC order (0..N)
}

export interface SceneEdge {
  from: SceneId;
  to: SceneId;
  tag?: "choice" | "auto" | "conditional";
}

export interface TOCGraph {
  nodes: SceneNode[];
  edges: SceneEdge[];
}
```

**Notes**

* `order` is authoritative for vertical placement.
* Edges can point forward (normal) or from earlier rows (merges). Back‑edges to older rows are allowed but should render with a subtle back curve; MVP may ignore back‑edges or clamp them.

---

## 3) Lane Layout Algorithm (GitKraken‑style)

**Purpose:** Assign each node a horizontal **lane index** so that branches are parallel colored rails, merges free lanes, and the S‑curves look like GitKraken.

**Algorithm (single pass over nodes sorted by `order`):**

1. Build maps `inEdges` and `outEdges` for nodes.
2. Keep `lanes: (SceneId | null)[]` and `laneByNode: Map<id, number>`
3. For each node `n` by `order`:

   * If **exactly one** incoming edge and parent has lane → **inherit** parent lane.
   * If **multiple** incoming → **merge**: pick **lowest lane** among parents as primary; **free** the other parent lanes (`lanes[i] = null`).
   * If **zero** incoming → allocate **first free** lane if any; else **append** a new lane.
4. Compute positions:

   * `x = padding.l + lane * laneGap`
   * `y = padding.t + order * rowGap`
5. For edges store `(x1,y1)->(x2,y2)`; set `stroke-dasharray` if `tag === "conditional"`.

**Complexity:** O(N log N + E) (sorting by order dominates). Memory O(N+E).

---

## 4) Rendering in SVG

Create `TocGraph.svelte` at `packages/cards/src/lib/toc-graph/TocGraph.svelte`:

```svelte
<script lang="ts">
  import type { TOCGraph } from "./types";
  export let graph: TOCGraph;
  export let laneGap = 84;     // px between lanes
  export let rowGap = 56;      // px between rows
  export let dotR = 7;         // node dot radius
  export let padding = { t: 24, r: 24, b: 24, l: 24 };
  const palette = ["#22d3ee","#60a5fa","#a78bfa","#f472b6","#34d399","#f59e0b","#ef4444"]; // reuse via modulo

  type PNode = { id:string; title:string; order:number; lane:number; x:number; y:number; color:string };
  type PEdge = { from:string; to:string; x1:number; y1:number; x2:number; y2:number; color:string; dash?:string };

  let nodesP:PNode[] = [];
  let edgesP:PEdge[] = [];
  let width = 800, height = 600, viewBox = "";

  function layout(g:TOCGraph){
    const inMap = new Map<string, any[]>(); const outMap = new Map<string, any[]>();
    g.nodes.forEach(n=>{ inMap.set(n.id,[]); outMap.set(n.id,[]); });
    g.edges.forEach(e=>{ inMap.get(e.to)!.push(e); outMap.get(e.from)!.push(e); });

    const sorted = [...g.nodes].sort((a,b)=>a.order-b.order);
    const laneBy = new Map<string, number>();
    const lanes:(string|null)[] = [];

    for(const n of sorted){
      const incoming = inMap.get(n.id)!;
      if(incoming.length===1 && laneBy.has(incoming[0].from)){
        const li = laneBy.get(incoming[0].from)!; laneBy.set(n.id, li); lanes[li] = n.id;
      } else if(incoming.length>1){
        const parents = incoming.map(e=>laneBy.get(e.from) ?? Number.POSITIVE_INFINITY).sort((a,b)=>a-b);
        const primary = Number.isFinite(parents[0]) ? parents[0] : (lanes.indexOf(null)===-1?lanes.length:lanes.indexOf(null));
        laneBy.set(n.id, primary); lanes[primary] = n.id; for(let i=1;i<parents.length;i++) if(Number.isFinite(parents[i])) lanes[parents[i]!] = null;
      } else {
        const idx = lanes.indexOf(null); const li = idx===-1 ? lanes.length : idx; laneBy.set(n.id, li); lanes[li] = n.id;
      }
    }

    nodesP = sorted.map(n=>{ const lane = laneBy.get(n.id)!; const x = padding.l + lane*laneGap; const y = padding.t + n.order*rowGap; const color = palette[lane % palette.length]; return {...n, lane, x, y, color}; });
    const byId = new Map(nodesP.map(n=>[n.id,n]));
    edgesP = g.edges.map(e=>{ const a = byId.get(e.from)!; const b = byId.get(e.to)!; const dash = e.tag==="conditional" ? "6 5" : undefined; return { from:e.from, to:e.to, x1:a.x, y1:a.y, x2:b.x, y2:b.y, color:a.color, dash }; });

    width = padding.l + (lanes.length-1)*laneGap + padding.r + 160; height = padding.t + (sorted.length-1)*rowGap + padding.b + 40; viewBox = `0 0 ${width} ${height}`;
  }

  function path(e:PEdge){ const dx = e.x2 - e.x1; const c1 = e.x1 + 0.35*dx; const c2 = e.x2 - 0.35*dx; return `M ${e.x1} ${e.y1} C ${c1} ${e.y1}, ${c2} ${e.y2}, ${e.x2} ${e.y2}`; }
  $: layout(graph);
</script>

<svg {viewBox} class="w-full h-full">
  {#each Array.from(new Set(nodesP.map(n=>n.lane))).sort((a,b)=>a-b) as lane}
    {#if nodesP.some(n=>n.lane===lane)}
      <line x1={padding.l + lane*laneGap} y1={padding.t - rowGap} x2={padding.l + lane*laneGap} y2={height - padding.b + rowGap} stroke-width="4" stroke-opacity=".25" stroke={palette[lane % palette.length]} />
    {/if}
  {/each}

  {#each edgesP as e (e.from+"->"+e.to)}
    <path d={path(e)} fill="none" stroke={e.color} stroke-width="3.5" stroke-linecap="round" stroke-dasharray={e.dash}/>
  {/each}

  {#each nodesP as n (n.id)}
    <g class="cursor-pointer">
      <circle cx={n.x} cy={n.y} r={dotR} fill={n.color}/>
      <text x={n.x+14} y={n.y} dominant-baseline="middle" class="fill-slate-800 dark:fill-slate-100 text-[13px] select-none">{n.title}</text>
    </g>
  {/each}
</svg>
```

---

## 5) Two‑Column Integration Component

Create `TocWithGraph.svelte` (demo + integration scaffold):

```svelte
<script lang="ts">
  import TocGraph from "./TocGraph.svelte";
  import type { TOCGraph } from "./types";

  export let graph: TOCGraph;
</script>

<div class="grid grid-cols-12 gap-6">
  <aside class="col-span-5 xl:col-span-4">
    <h2 class="text-xl font-semibold mb-3">Table of Contents</h2>
    <ol class="space-y-2">
      {#each [...graph.nodes].sort((a,b)=>a.order-b.order) as n}
        <li class="rounded border bg-base-100/60 px-3 py-2">
          <div class="font-mono text-sm">{n.title}</div>
          <div class="text-xs text-slate-500">id: {n.id}</div>
        </li>
      {/each}
    </ol>
  </aside>

  <section class="col-span-7 xl:col-span-8 min-h-[420px]">
    <div class="h-full rounded border bg-base-200/40 p-3">
      <TocGraph {graph} />
    </div>
  </section>
</div>
```

**Route wiring (example):** expose a page/route that converts your current TOC DB into `TOCGraph` props and renders `<TocWithGraph/>` next to the existing TOC view.

---

## 6) Styling Guidelines (Tailwind)

* Place the graph container in a card with `bg-base-200/40` and `border` to match the UI in screenshots.
* Colors come from the palette array; no Tailwind color classes needed for SVG strokes.
* For dark mode text inside `<text>` elements: use `fill-slate-100`; for light mode: `fill-slate-800`.

---

## 7) Interactions (MVP → Nice‑to‑have)

**MVP**

* Click node → dispatch custom event `select` with `node.id`; parent syncs selection in TOC list.
* Hover → add `<title>` to the `<g>` to get native SVG tooltips.

**Nice‑to‑have**

* **Pan/Zoom:** implement `usePanZoom.ts` that mutates `viewBox` on wheel and drag.
* **Edge styles by tag:** `conditional` uses `stroke-dasharray="6 5"`; `choice` ends with a small chevron marker.
* **Minimap:** optional small SVG in corner showing viewport rect.

---

## 8) Performance Notes

* All calculations are numeric (no DOM queries). Recompute layout only when `graph` changes.
* Keep `rowGap` ≥ 48 for readability; reduce if TOCs are very tall.
* For >1500 nodes, omit rail lines or lower stroke opacity.

---

## 9) Testing Plan

* **Lane correctness** (vitest):

  * Single chain → all nodes lane 0
  * Split at node 2 to two children → new lane allocated
  * Merge of two parents → child occupies min(parentLane); freed lanes become available
* **SVG snapshot**: shallow snapshot of `path d` values for deterministic edges
* **UI (Playwright):**

  * Renders without overflow at default container width
  * Clicking a node emits `select` with the correct id
  * Resizing container keeps alignment of labels and dots

---

## 10) Integration with DB/API

* The server already exposes scenes and links. Provide an adapter:

```ts
// mapDbToGraph.ts
import type { TOCGraph } from "./types";
export function mapDbToGraph(dbScenes, dbLinks): TOCGraph {
  return {
    nodes: dbScenes.map((s, i) => ({ id: s.id, title: s.title, order: s.order ?? i })),
    edges: dbLinks.map(l => ({ from: l.from_id, to: l.to_id, tag: l.tag as any }))
  };
}
```

* Ensure the route passes `graph={mapDbToGraph(...)} ` to `TocWithGraph`.

---

## 11) Config Flags

* `laneGap`, `rowGap`, `dotR` are props with sensible defaults; read from user prefs later.
* Palette can be provided as prop for themeing.

---

## 12) Example Data (for manual verification)

```ts
export const demo: TOCGraph = {
  nodes: [
    { id:"scene_haunted_house", title:"scene_haunted_house", order:0 },
    { id:"skoven", title:"Skoven", order:1 },
    { id:"kælder", title:"Kælder", order:2 },
    { id:"taget", title:"Taget", order:3 },
    { id:"finale", title:"Finale", order:4 },
  ],
  edges: [
    { from:"scene_haunted_house", to:"skoven", tag:"choice" },
    { from:"skoven", to:"kælder" },
    { from:"skoven", to:"taget", tag:"conditional" },
    { from:"kælder", to:"finale" },
    { from:"taget", to:"finale" },
  ]
};
```

---

## 13) Accessibility

* Ensure each `<g>` has a `<title>` with scene title; this renders screen‑reader labels and native tooltips.
* Maintain minimum 3:1 contrast for lane colors against background (adjust palette if needed).

---

## 14) Acceptance Criteria

* Graph renders beside TOC, stays aligned during resize
* Branching and merging produce visually distinct lanes with rails and S‑curves
* Conditional edges are dashed
* Clicking a node highlights corresponding TOC entry (class toggle) and vice‑versa (optional)
* No runtime errors in console; tests pass

---

## 15) CHANGELOG (keep updating)

* **v0.1.0**: Initial lane layout, SVG render, two‑column demo

---

## 16) TEST‑PROOF Checklist

* [ ] Lane assignment unit tests cover inherit/merge/new branch
* [ ] Playwright click emits `select` with correct id
* [ ] ViewBox pan/zoom (if implemented) keeps labels readable
* [ ] Demo renders with real TOC DB

---

## 17) Implementation Order (for AI Coder)

1. Create `types.ts` and `TocGraph.svelte` exactly as above.
2. Wire demo `TocWithGraph.svelte` and a route to display it.
3. Implement adapter from DB → `TOCGraph`.
4. Add simple click→select event and TOC sync.
5. Add Playwright tests & vitest unit tests.
6. Optional: pan/zoom utility and dashed edge styles.

---

## 18) Commit Message Template

```
feat(toc-graph): add GitKraken-style SVG lanes with S-curves and TOC integration
- lane assignment (inherit/merge/new branch)
- rails + bezier edges + node dots + labels
- demo TocWithGraph.svelte
- types + adapter stub
- baseline tests (vitest + Playwright)
```

> End of guide.
