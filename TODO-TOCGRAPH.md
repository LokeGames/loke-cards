# TODO: TOC-GRAPH Feature Implementation

**Feature**: GitKraken-style TOC Graph Visualization
**Branch**: `feature/toc-graph`
**Spec**: `doc/NEXT/1_TOC.md`
**Status**: In Progress

---

## Phase 1: Core Module Implementation ✅ DONE

### 1.1 Data Model ✅ DONE
- [x] Create `packages/cards/src/lib/toc-graph/types.ts`
  - SceneId, SceneNode, SceneEdge, TOCGraph interfaces
  - **Location**: `packages/cards/src/lib/toc-graph/types.ts`

### 1.2 TocGraph Component ✅ DONE
- [x] Create `packages/cards/src/lib/toc-graph/TocGraph.svelte`
  - Lane layout algorithm (inherit/merge/new branch)
  - Pure SVG rendering with rails + S-curves + dots
  - Reactive layout on graph changes
  - Color palette (7 colors, reuse via modulo)
  - **Location**: `packages/cards/src/lib/toc-graph/TocGraph.svelte`

### 1.3 Integration Component ✅ DONE
- [x] Create `packages/cards/src/lib/toc-graph/TocWithGraph.svelte`
  - Two-column layout: TOC list (left) + graph (right)
  - Grid layout with Tailwind (col-span-5 / col-span-7)
  - **Location**: `packages/cards/src/lib/toc-graph/TocWithGraph.svelte`

### 1.4 Database Adapter ✅ DONE
- [x] Create `packages/cards/src/lib/toc-graph/mapDbToGraph.ts`
  - Convert DbScene[] + DbLink[] → TOCGraph
  - **Location**: `packages/cards/src/lib/toc-graph/mapDbToGraph.ts`

---

## Phase 2: Demo Route & Integration ✅ DONE

### 2.1 Create Demo Route ✅ DONE
- [x] Create `apps/cards/src/routes/toc-graph/+page.svelte`
  - Import TocWithGraph component
  - Load scenes + links from database via shared/database
  - Use mapDbToGraph adapter
  - Render demo with real project data
- [x] Create `apps/front/src/routes/cards/toc-graph/+page.svelte` (main app route)

### 2.2 Data Loading ✅ DONE
- [x] Fetch scenes from `db.getAllScenes()`
- [x] Extract links from Scene.choices[] (no separate links table exists)
- [x] Transform to TOCGraph format using mapDbToGraph
- [x] Handle empty state (no scenes/links)

### 2.3 Add Navigation Link ✅ DONE
- [x] Add "TOC Graph" link to cards app menu (`apps/cards/src/menu.ts`)
- [x] Created package exports (`packages/cards/package.json`, `packages/cards/src/lib/toc-graph/index.ts`)
- [x] Added workspace dependencies to apps/cards and apps/front

---

## Phase 3: Testing 🔄 PENDING

### 3.1 Unit Tests (vitest)
- [ ] Test lane layout algorithm
  - Single chain → all nodes lane 0
  - Split at node → new lane allocated
  - Merge of two parents → child occupies min(parentLane), other lanes freed
  - Multiple branches and merges
- [ ] Test mapDbToGraph adapter
  - Empty input → empty graph
  - Scenes with explicit order
  - Scenes without order (use index)
  - Links with different tags (choice, auto, conditional)

### 3.2 Playwright UI Tests
- [ ] Graph renders without overflow
- [ ] Clicking node shows correct tooltip (title element)
- [ ] Resizing container maintains alignment
- [ ] Conditional edges render as dashed lines
- [ ] Rails render with correct opacity

### 3.3 Agentic Testing
- [ ] Create `tests/agent/test-toc-graph.ts`
  - Navigate to `/cards/toc-graph`
  - Verify graph is visible
  - Check SVG elements (rails, edges, nodes)
  - Verify console has no errors

---

## Phase 4: Documentation & Polish 🔄 PENDING

### 4.1 Documentation
- [ ] Update `CHANGELOG.md` with v0.3.0 TOC-GRAPH feature
- [ ] Update `TEST-PROOF.md` with test results
- [ ] Add TOC-GRAPH section to README.md

### 4.2 Code Quality
- [ ] Run type check: `pnpm check:types`
- [ ] Fix any TypeScript errors
- [ ] Review component props and types

### 4.3 Optional Enhancements
- [ ] Implement `usePanZoom.ts` for SVG pan/zoom
- [ ] Add click→select event (dispatch custom event)
- [ ] Add edge markers for choice edges (chevron/arrow)
- [ ] Add minimap in corner

---

## Phase 5: Git & Deployment 🔄 PENDING

### 5.1 Commit & Push
- [ ] Git add all new files
- [ ] Commit with message:
  ```
  feat(toc-graph): add GitKraken-style SVG lanes with S-curves and TOC integration

  - lane assignment (inherit/merge/new branch)
  - rails + bezier edges + node dots + labels
  - demo TocWithGraph.svelte with real project data
  - types + mapDbToGraph adapter
  - baseline tests (vitest + Playwright)

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```
- [ ] Push feature branch to origin

### 5.2 Merge to Dev
- [ ] Test all features work in dev environment
- [ ] Merge `feature/toc-graph` → `dev`
- [ ] Delete local feature branch
- [ ] Push to origin/dev

---

## Current Status Summary

**✅ Completed**:
- Core module structure (`types.ts`, `TocGraph.svelte`, `TocWithGraph.svelte`, `mapDbToGraph.ts`)
- Lane layout algorithm implementation
- SVG rendering with rails, S-curves, dots, labels

**🔄 Next Steps**:
1. Create demo route at `apps/cards/src/routes/toc-graph/+page.svelte`
2. Load real scene/link data from database
3. Add navigation link to menu
4. Write unit tests for lane algorithm
5. Write Playwright/agentic tests

**🔧 Technical Notes**:
- Using Svelte 5 runes syntax ($state, $effect, $props)
- Pure SVG rendering (no Canvas/D3)
- Algorithm complexity: O(N log N + E)
- Palette: 7 colors reused via modulo
- Lane gap: 84px, Row gap: 56px (configurable props)

---

## Files Created

```
packages/cards/src/lib/toc-graph/
├── types.ts                    # ✅ Graph data model
├── TocGraph.svelte             # ✅ SVG renderer with lane layout
├── TocWithGraph.svelte         # ✅ Two-column integration
└── mapDbToGraph.ts             # ✅ Database adapter

apps/cards/src/routes/toc-graph/
└── +page.svelte                # ⏳ TODO: Demo route
```

---

## Database Schema Requirements

Need to verify/implement:
- Scenes table with `id`, `title`, `order` fields
- Links/Edges table with `from_id`, `to_id`, `tag` fields
- Check `@loke/shared/database` for available queries

---

**Last Updated**: 2025-10-25 22:25
**Updated By**: Claude Code
