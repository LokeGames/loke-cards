# TOC-Graph (gitgraph.js) — Revised TODO (Aligned Rows)

**Problem addressed:** In the previous version, the gitgraph nodes were not aligned with the same table rows as the scene cards. This version ensures that **each node and its scene card share the same horizontal row** within the TOC grid.

---

## 🎯 Goal

Integrate **gitgraph.js** directly into the TOC’s grid layout so that each scene card’s node and connections are rendered in the same row. The visual graph becomes a **left-side gutter column**, perfectly synced with TOC rows.

---

## 1. Layout Principle

* One unified **grid layout** for TOC and graph.
* Each **scene row** contains:

  * Left cell → graph gutter (gitgraph node + lanes)
  * Right cell → scene card

Example structure:

```svelte
<div class="grid grid-cols-[80px_1fr] auto-rows-[56px]">
  {#each scenes as scene, i}
    <div class="relative" id={`lane-${i}`}>
      <!-- Node + line rendered here -->
    </div>
    <SceneCard {scene} />
  {/each}
</div>
```

The gitgraph renderer attaches to a shared `<svg>` inside the gutter and uses scene row indices for Y positions.

---

## 2. Integration Strategy

Two viable options:

### **Option A: Shared SVG per chapter (recommended)**

* One gitgraph instance per chapter or TOC section.
* Each scene corresponds to a `commit()`.
* `Y = rowIndex * rowHeight + rowHeight / 2` ensures alignment.
* Lanes (branches) are colored distinctly and extend vertically between rows.

### **Option B: Mini graph per row**

* Each row renders its own small segment with one node and line to next row.
* Easier to sync alignment, but higher DOM cost.

✅ Use **Option A** for performance and smoother visuals.

---

## 3. Data Mapping

Input:

```ts
Scene = { id: string; title: string; order: number; chapter: string }
Link = { from: string; to: string }
```

Mapping rules:

* Scenes sorted by visual order.
* Each scene = `commit()` in gitgraph.
* Links define cross-lane connections (simple merge or new branch).
* New lanes (branches) auto-create when multiple outgoing links exist.
* Assign new colors sequentially from palette.

---

## 4. Implementation Outline

1. **Install:** `pnpm add @gitgraph/js`
2. **Create** `TocGraphGitgraph.svelte`.
3. **Layout:** Parent grid with `[80px_1fr]` columns.
4. **Mount gitgraph:**

   ```ts
   import { createGitgraph } from '@gitgraph/js';
   const container = document.getElementById('toc-graph');
   const gitgraph = createGitgraph(container);
   ```
5. **Render commits** using scene order for Y offsets.
6. **Apply links:** use `branch.merge()` for connections.
7. **Sync scroll:** ensure graph scrolls with TOC (same parent container).

---

## 5. Styling & Theme

* **Node:** radius 6–8px, solid fill with lane color.
* **Line:** 2px stroke.
* **Colors:** cycle `[#60a5fa, #34d399, #a78bfa, #fbbf24, #f87171]`.
* **Background:** transparent; aligns with TOC dark theme.
* **Hover:** highlight corresponding node + lane when scene card hovered.

---

## 6. Acceptance Criteria

* Each node aligns precisely with its scene card.
* Graph scrolls naturally with TOC.
* Each new link opens a new colored lane.
* Visuals match GitKraken’s lane graph feel.

---

## 7. Future Options

* Add clickable nodes → navigate to scene.
* Animate link drawing.
* Merge multiple chapters into unified graph with color-coded lanes.
* Add mini-map or branch legend later.
