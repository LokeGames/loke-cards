## Phase 5 — Extended: NodeView (Graph)
-[] Inherit templeting from loke-cards


Goal: Twine‑style visual graph for chapters and scenes using Vue Flow. Chapters act as containers; scenes are nodes; edges represent links between scenes (intra‑ and inter‑chapter).

References: see `doc/cards-vue-flow.md` for architecture, builders, and layout helpers.

### 5.E.0 Dependencies (status)
- [x] `@vue-flow/core`, `@vue-flow/minimap`, `@vue-flow/background`, `elkjs` are listed in `package.json` (no extra install needed)

### 5.E.1 Files & Structure
- [ ] `src/stores/graph.js` — Pinia store for chapters/scenes/links (loadGlobal/loadChapter)
- [ ] `src/graph/builders.js` — build chapter nodes, scene nodes, and edges
- [ ] `src/graph/layout.js` — ELK auto‑layout helper (optional, togglable)
- [ ] `src/graph/nodeTypes.js` — register custom node components
- [x] `src/components/nodes/SceneNode.vue` — exists (style/props per doc)
- [x] `src/components/nodes/ChapterNode.vue` — exists (container style)
- [ ] `src/components/ChapterGraph.vue` — per‑chapter view (scenes + intra links)
- [ ] `src/components/GlobalGraph.vue` — all chapters as group containers + inter links

### 5.E.2 Routes & Navigation (External App)
- [x] Global graph route: `/` → `GlobalGraph.vue`
- [x] Per‑chapter graph route: `/chapter/:id` → `ChapterGraph.vue` (props: `id`)
- [ ] Double‑click chapter container in `GlobalGraph` opens per‑chapter route

### 5.E.3 Data Sources & Offline
- [ ] Use `src/api/client.js` for network; fallback to `src/lib/storage.js` when API fails
- [ ] Graph store composes from existing data shape: `chapters`, `scenes`, optional `links`
- [ ] If `links` are not persisted yet, derive edges from `choices` (scene.choice.next → edge)
- [ ] Persist node positions in store/DB on drag‑stop to keep layout stable

### 5.E.4 Interactions
- [ ] Drag nodes (scenes/chapters); on drag‑stop persist `position`
- [ ] Connect scenes by drawing an edge; on connect, create `link` (or choice) in data layer
- [ ] Delete nodes/edges → reflect in data and update graph
- [ ] Fit‑view/zoom controls; Minimap; Background grid
- [ ] Click node → open Scene editor; context menu → quick actions (rename, delete, add link)

### 5.E.5 Layout
- [ ] When positions are missing, run ELK auto‑layout (see `layoutScenes()` in doc)
- [ ] Toggle: Auto‑layout now vs. preserve saved positions
- [ ] Save positions back to repo after auto‑layout

### 5.E.6 Styling & Theming
- [ ] Use Tailwind classes with dark mode variants for nodes and containers
- [ ] Edge styles by type: `jump` (animated), `condition` (dashed), `return` (reversed marker), `fork` (bold)
- [ ] Responsive canvas; ensure good performance with many nodes (avoid excessive reactivity)

### 5.E.7 Keyboard & A11y
- [ ] Keyboard delete on selection removes nodes/edges
- [ ] Tab focus order within NodeView toolbar
- [ ] ARIA labels for toolbar controls; sufficient contrast in dark mode

### 5.E.8 Testing (Playwright)
- [ ] Global graph renders chapters as containers and scenes within
- [ ] Per‑chapter view shows only that chapter’s scenes
- [ ] Edge counts match derived links/choices
- [ ] Double‑click chapter opens per‑chapter NodeView
- [ ] Drag scene persists position and survives reload
- [ ] Connect creates a new link edge
- [ ] Snapshot(s) for node/edge counts and basic layout

### 5.E.9 Minimal Milestone (mergeable)
- [x] Static render of GlobalGraph and ChapterGraph with derived edges
- [x] Navigation between Global ↔ Chapter views
- [x] Fit‑view + Minimap + Background

Status: External app `apps/nodeview` up with routes `/` and `/chapter/:id`. Uses loke-cards CSS and independent store/API.
