# TOC-Graph (gitgraph.js) — Simplified TODO

**Goal:** Keep the existing Table of Contents view, indent it slightly, and render a GitKraken‑style lane graph in a narrow left gutter using **gitgraph.js**. Circles (nodes) align with each scene card; colored vertical lanes represent links between scenes. No custom SVG algorithms—only gitgraph.js.

---

## 0) Scope

* **In-scope:** Visual graph-only; no edit UI, no pan/zoom, no mini-map.
* **Out-of-scope:** Complex merge heuristics, curved splines beyond gitgraph defaults, exporting.

---

## Branch & Isolation

* Work on a dedicated git branch named `toc-graph` so the experiment stays isolated from `main`.
* Duplicate the existing `TableOfContentsView.svelte` into a new graph-enabled view (e.g. `GraphTocView.svelte`) inside `apps/cards/src/module/views/`.
* Wire the duplicate into the `toc-graph` loader/menu entries only; leave the original TOC route untouched so regular users remain unaffected while we iterate.
* ✅ Validated in `Loke Cards: scifi-space-odyssey-2025` — this duplication approach renders correctly and will be our forward path.

---

## 1) Install & Wire-Up

1. `pnpm add @gitgraph/js`
2. Create `packages/cards/src/lib/toc-graph-gitgraph/` with:

   * `TocGraphGitgraph.svelte` — renders the gutter and mounts gitgraph.js.
   * `mapTocToGitgraph.ts` — converts **scenes + links** → sequence of gitgraph operations.
3. Route: reuse existing TOC page. Wrap list in a 2‑column layout (gutter + content).

```txt
apps/cards/src/routes/toc/+page.svelte     # existing TOC
packages/cards/src/lib/toc-graph-gitgraph/
  ├─ TocGraphGitgraph.svelte
  └─ mapTocToGitgraph.ts
```

---

## 2) Layout (UI-only)

* **Grid:** `grid-cols-[gutter_96px,content_1fr]` (Tailwind arbitrary sizes ok).
* **Indent TOC:** add `pl-4` inside content column so cards shift slightly right.
* **Row anchors:** expose a hidden anchor `<div>` per TOC row (cf. `doc/gitgraph.html`). Measure anchors with `ResizeObserver` and feed their midpoints into the graph overlay so nodes stay glued even when card height varies.
* **Gutter:** `position: relative;` container scrolls with the TOC list; stretch the SVG overlay to the measured height (no sticky positioning).

Acceptance: Node centers are vertically aligned with the visual mid of each scene card.

---

## 3) Data Mapping (Simple)

Input from DB / state you already have:

```ts
Scene = { id: string; title: string; order?: number }
Link  = { from: string; to: string }
```

Rules (keep dumb/simple):

* Sort scenes by `order ?? index` → this becomes the **commit order**.
* Each **scene** = one **commit** on a lane/branch.
* Each **link (A→B)** creates a **temporary branch** from A's lane that targets B.
* If a scene already has a lane, reuse it; otherwise allocate **next free lane**.
* **Colors:** sequential palette per lane (not per link). New lane → next color.

Notes:

* We are not replicating true git semantics—just using gitgraph primitives to draw lanes.

---

## 4) Implementation Sketch

### 4.1 `mapTocToGitgraph.ts`

* Export `layoutSceneGraph` to assign deterministic lanes (reused by both gitgraph adapter and custom SVG overlay).
* Existing `mapTocToGitgraph` keeps gitgraph compatibility, but lane data is shared.

### 4.2 `SceneFlowGraph.svelte`

* SVG overlay that receives lane-assigned nodes + real row midpoints.
* Draws lane rails, S-curves, and node dots based on measured `y` coordinates.
* Keeps styling inline with Cards UI while matching table rows pixel-for-pixel.

---

## 5) Styling Rules

* **Lane colors:** cycle through e.g. `[#60a5fa,#22d3ee,#a78bfa,#34d399,#f472b6,#f59e0b,#ef4444]`.
* **Node style:** small filled circle (no emoji), ring: `#0f172a` to match dark UI.
* **Lines:** 2px.
* **Hover:** Optional: lighten the lane on hover of corresponding card using shared scene id.

---

## 6) Minimal Acceptance Criteria

* The TOC list renders unchanged except a small left indent.
* A gutter shows a vertical, colored lane graph.
* Each scene has a circle aligned with its card.
* Links create visible colored connections using gitgraph.
* New lanes get new colors automatically.
* No horizontal scroll explosion; graph stays within gutter width.

---

## 7) Quick Test Plan (no heavy infra)

* Empty scenes → graph area renders empty without errors.
* Single chain of scenes (no links) → one lane with aligned nodes.
* A→B link where `B` is below `A` → visible vertical path across rows.
* Two links from one scene → two lanes with distinct colors.

---

## 8) Tasks Checklist

* [x] Add dependency `@gitgraph/js`.
* [x] Implement `mapTocToGitgraph.ts` (simple allocator).
* [x] Implement `TocGraphGitgraph.svelte` and mount in TOC route.
* [x] Provide color palette + small theme tweaks.
* [x] Verify alignment with real data (row anchors + measured overlay).
* [x] Render choice edges via custom SVG overlay (SceneFlowGraph).
* [ ] Add README section (2–3 paragraphs).

---

## 9) Notes / Future

* If lanes overlap too much, consider **max lanes per chapter** and fold extra as dotted.
* SceneFlowGraph overlay now mirrors the approach in `doc/gitgraph.html`; gitgraph adapter is retained for standalone/legacy routes.
* If we later need curved merges or pan/zoom, we can extend the custom SVG while keeping the same layout API.
