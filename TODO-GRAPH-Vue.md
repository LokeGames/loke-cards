## Phase 5 — Extended: NodeView (Graph)
- [x] Inherit templeting from loke-cards


Goal: Twine‑style visual graph for chapters and scenes using Vue Flow. Chapters act as containers; scenes are nodes; edges represent links between scenes (intra‑ and inter‑chapter).

References: see `doc/cards-vue-flow.md` for architecture, builders, and layout helpers.

### Funktionsbeskrivelse: Global Graph

**Hovedformål: Det store overblik**

Global Graph-visningen fungerer som et "fugleperspektiv" over hele din historie. I stedet for at se på én scene eller ét kapitel ad gangen, giver den dig et komplet kort over alle dine kapitler og scener, og hvordan de er forbundet.

**Funktionalitet:**

*   **Kapitler som "containere":** Hvert kapitel vises som en stor, separat boks. Dette giver en klar visuel adskillelse af historiens hoveddele.
*   **Scener som "knudepunkter":** Inde i hver kapitel-container ligger de enkelte scener som mindre knudepunkter (nodes), hvilket giver et hurtigt overblik over flowet i hvert kapitel.
*   **Komplet overblik over forbindelser:** Viser alle links mellem scener, både *inden for* samme kapitel og, vigtigst af alt, links der går *mellem* kapitler. Dette gør det let at spore komplekse narrative tråde.

**Interaktioner:**

*   **Navigation:** Dobbeltklik på en kapitel-container for at "zoome ind" til den detaljerede `ChapterGraph`-visning.
*   **Layout-kontrol:** Træk og flyt kapitler og scener for at organisere lærredet. Layoutet kan gemmes. En "Auto Layout"-knap er også tilgængelig for automatisk arrangering.
*   **Standard-værktøjer:** Inkluderer et minimap for hurtig navigation samt pan- og zoom-funktioner.
*   **Oprette links:** Træk en linje mellem scener for at oprette nye valg eller forbindelser.

Kort sagt er Global Graph det primære værktøj til at planlægge, visualisere og administrere den overordnede struktur i en interaktiv fortælling.

### Funktionsbeskrivelse: Chapter Graph (Kapitel-visning)

**Hovedformål: Detaljeret og fokuseret redigering**

Hvor Global Graph giver dig det store overblik, er kapitel-visningen dit "værksted" for et enkelt kapitel. Formålet er at fjerne unødvendig støj, så du kan koncentrere dig om at skrive, organisere og forbinde scenerne i det kapitel, du arbejder på.

**Funktionalitet:**

*   **Fokuseret visning:** Viser *kun* scenerne, der hører til det valgte kapitel. Alle andre kapitler og scener er skjult for at skabe fokus.
*   **Kun interne links:** Viser kun forbindelser mellem scener *inden for* det aktuelle kapitel.
*   **Primært arbejdsområde:** Designet til at være det primære sted for at arrangere scener, skabe nye valg og justere flowet i en afgrænset del af historien.

**Interaktioner:**

*   **Navigation:** Tilgås ved at dobbeltklikke på et kapitel i Global Graph eller ved at vælge det fra sidepanelet.
*   **Arrangering af scener:** Scener kan frit trækkes og flyttes rundt. Deres positioner kan gemmes for at bevare en konsistent struktur.
*   **Oprettelse:** Understøtter oprettelse af nye scener og links imellem dem inden for kapitlets rammer.
*   **Standard-værktøjer:** Inkluderer pan, zoom og et minimap for at gøre det nemt at navigere, selv i store kapitler.

Sammenfattende er kapitel-visningen din "dybdegående" editor, der komplementerer Global Graphs "strategiske" overblikskort.

### 5.E.0 Dependencies (status)
- [x] `@vue-flow/core`, `@vue-flow/minimap`, `@vue-flow/background`, `elkjs` are listed in `package.json` (no extra install needed)

### 5.E.1 Files & Structure (apps/graph)
- [x] `src/graph/stores/graph.js` — Pinia store for chapters/scenes/links
- [x] `src/graph/builders.js` — build chapter nodes, scene nodes, and edges
- [x] `src/graph/layout.js` — ELK auto‑layout helper (optional, togglable)
- [x] `src/graph/nodeTypes.js` — register custom node components
- [x] `src/graph/components/nodes/SceneNode.vue` — node component
- [x] `src/graph/components/nodes/ChapterNode.vue` — container node
- [x] `src/graph/components/ChapterGraph.vue` — per‑chapter view
- [x] `src/graph/components/GlobalGraph.vue` — global view
- [x] `src/graph/api/client.js` — API client with health gating
- [x] `src/graph/lib/storage.js` — LocalForage (separate namespace)

### 5.E.2 Routes & Navigation (External App)
- [x] Global graph route: `/` → `GlobalGraph.vue`
- [x] Per‑chapter graph route: `/chapter/:id` → `ChapterGraph.vue` (props: `id`)
- [x] Double‑click chapter container in `GlobalGraph` opens per‑chapter route

### 5.E.3 Data Sources & Offline (WAIT UNTIL LOKE-CARDS IS PWA READY AND OFFLINE SECURED)
- [ ] Use `src/api/client.js` for network; fallback to `src/lib/storage.js` when API fails
- [ ] Graph store composes from existing data shape: `chapters`, `scenes`, optional `links`
- [ ] If `links` are not persisted yet, derive edges from `choices` (scene.choice.next → edge)
- [ ] Persist node positions in store/DB on drag‑stop to keep layout stable

### 5.E.4 Interactions
- [x] Drag nodes (scenes/chapters); on drag‑stop persist `position`
- [x] Connect scenes by drawing an edge; on connect, create `link` (or choice) in data layer
- [x] Delete nodes/edges → reflect in data and update graph
- [x] Fit‑view/zoom controls; Minimap; Background grid
- [ ] Click node → open Scene editor; context menu → quick actions (rename, delete, add link)

### 5.E.5 Layout (NEXT PHASE)
- [x] When positions are missing, run ELK auto‑layout (see `layoutScenes()` in doc) - implemented but needs tuning
- [ ] Auto-fit: ensure nodes are visible on load (fit-view-on-init not working as expected)
- [ ] Auto-order: better initial placement, avoid overlaps
- [ ] Toggle: Auto‑layout now vs. preserve saved positions
- [ ] Save positions back to repo after auto‑layout

### 5.E.6 Styling & Theming
- [ ] Use Tailwind classes with dark mode variants for nodes and containers
- [ ] Edge styles by type: `jump` (animated), `condition` (dashed), `return` (reversed marker), `fork` (bold)
- [ ] Responsive canvas; ensure good performance with many nodes (avoid excessive reactivity)

### 5.E.7 Keyboard & A11y
- [x] Keyboard delete on selection removes nodes/edges
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

Status: External app `apps/graph` up with routes `/` and `/chapter/:id`. Uses loke-cards CSS and independent store/API.

**2025-10-20 Update:**
- Fixed critical startup issues: missing `<script setup>` tag, incorrect CSS imports, invalid ThemeToggle path
- Fixed orphan SQLite records breaking Vue Flow: store now filters null/invalid scene IDs
- Fixed Vue Flow rendering: added theme CSS, fixed layout/sizing, created missing chapter01
- **CONFIRMED WORKING**: Graph app renders Vue Flow correctly at http://localhost:8092 ✅
- Vue Flow controls: Fit View, Minimap, Background grid present
- Auto-layout (ELK) implemented but needs tuning - deferred to next phase

Moved from nodeview to @src/graph:
- components: GlobalGraph.vue, ChapterGraph.vue, nodes/ChapterNode.vue, nodes/SceneNode.vue
- builders.js, layout.js, nodeTypes.js
- stores/graph.js, api/client.js, lib/storage.js
