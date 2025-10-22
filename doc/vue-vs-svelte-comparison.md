# Vue vs Svelte Implementation Comparison Report

## Oversigt

Denne rapport analyserer og sammenligner Vue-implementeringen i `cards-vue/` med den nuværende Svelte-implementering i `apps/front/src/` og `apps/cards/`. Formålet er at identificere manglende funktionalitet i Svelte-versionen og vurdere om det ville hjælpe med porteringsprocessen at gøre `cards-vue` kørebar.

## 1. UI-forskelle og manglende funktionalitet

### 1.1 Dashboard-funktionalitet

**Vue-implementering (cards-vue):**

- Fuldt funktionelt Dashboard med:
  - Quick Actions (New Scene, New Chapter)
  - Project Stats (antal chapters/scenes)
  - Recent Chapters liste
  - Recent Scenes liste
  - Offline-first datahåndtering
  - Live updates fra lokale dataændringer

**Svelte-implementering:**

- `apps/front/src/routes/+page.svelte`: Kun "Shell Home" med minimal tekst
- `apps/cards/`: Ingen dashboard-rute
- **Mangler:** Komplet dashboard-funktionalitet

### 1.2 Scene Management

**Vue-implementering:**

- `SceneListView.vue`: Komplet liste med søgning, sortering, sletning
- `SceneEditorView.vue`: Fuld editor med:
  - Scene ID validering
  - Chapter selection med "create chapter" funktion
  - Scene text editor
  - Choices list
  - State changes list
  - Meta felt
  - Code preview (local/server)
  - Real-time validering
  - Offline-first gemning

**Svelte-implementering:**

- `apps/front/src/routes/cards/scenes/+page.svelte`: Simpel liste uden funktionalitet
- `apps/front/src/routes/cards/editor/+page.svelte`: Bruger `SceneEditorView` fra `@apps-cards`
- `apps/cards/src/components/SceneEditorView.svelte`: Eksisterer men ikke integreret
- **Mangler:** Søgning, sortering, sletning, fuld CRUD-funktionalitet

### 1.3 Chapter Management

**Vue-implementering:**

- `ChapterListView.vue`: Komplet liste med:
  - Drag-and-drop reordering
  - Move up/down knapper
  - New Scene per chapter
  - Edit/Delete funktioner
  - Project scoping
- `ChapterEditorView.vue`: Fuld editor med validering

**Svelte-implementering:**

- `apps/front/src/lib/components/ChapterManager.svelte`: Grundlæggende chapter creation
- `apps/front/src/routes/chapters/+page.svelte`: Bruger ChapterManager
- `apps/front/src/routes/chapter/new/+page.svelte`: Bruger ChapterManager
- **Mangler:** Chapter list management, reordering, edit/delete, scene-per-chapter

## 2. Manglende Forms

### 2.1 New Scene Form

**Vue:** `/scene/new` - fuld form med alle felter og validering
**Svelte:** `/scene/new/+page.ts` - redirect kun, ingen form

### 2.2 New Chapter Form

**Vue:** `/chapter/new` - fuld form med ID-validering, meta, etc.
**Svelte:** `ChapterManager.svelte` - simpel form med kun titel

### 2.3 Edit Forms

**Vue:** `/scene/:id` og `/chapter/:id` - fulde edit forms
**Svelte:** Ingen edit routes implementeret

## 3. Dashboard Design Forskelle

### Vue Dashboard Design:

- **Layout:** Max-w-6xl mx-auto, p-6 spacing
- **Sektioner:** Quick Actions grid, Stats grid, Recent lists
- **Interaktivitet:** RouterLinks, live data, search/filter
- **Visuelt:** Card-based design med borders, hover states

### Svelte "Dashboard":

- **Layout:** Ingen
- **Indhold:** Kun "Shell Home" tekst
- **Interaktivitet:** Ingen
- **Visuelt:** Minimalt

## 4. TOC (Table of Contents) Design Forskelle

### Vue TOC (`BookTocView.vue`):

- **Funktionalitet:**
  - Søgning og chapter filter
  - Grouped by chapter med scene lanes
  - TocRow components med farvekodning
  - Click-to-edit navigation
  - Scene count per chapter
- **Design:** Card layout med borders, responsive grid

### Svelte TOC (`/toc/+page.svelte`):

- **Funktionalitet:** Kun placeholder tekst
- **Design:** Ingen
- **Mangler:** Komplet TOC-implementering

## 5. Overall User Interaction/UX Forskelle

### Navigation Pattern

**Vue:**

- Central router med alle routes defineret
- Breadcrumbs navigation
- Quick actions i sidebar
- Project scoping guards

**Svelte:**

- Fragmenteret routes mellem `front/` og `cards/`
- Ingen central navigation
- Sidebar menu eksisterer men mange links virker ikke

### Data Management

**Vue:**

- Offline-first med LocalForage
- Pinia stores for state management
- Live updates via events
- API client med fallback til local storage

**Svelte:**

- SharedWorker med Comlink
- Simpel Map-based storage
- Ingen offline-first strategi
- Ingen live updates

### Form Validation

**Vue:**

- Composable `useSceneValidation`
- Real-time validering
- Field-specific error messages
- Toast notifications

**Svelte:**

- Ingen validering implementeret
- Ingen error handling
- Ingen toast system

### Responsive Design

**Vue:**

- Mobile-first med breakpoints
- Touch-friendly controls
- Collapsible sections
- Proper grid layouts

**Svelte:**

- Grundlæggende Tailwind klasser
- Ingen specifik mobile optimisering

## 6. Komponent Arkitektur

### Vue Component Structure:

```
src/
├── components/
│   ├── dashboard/ (4 components)
│   ├── toc/ (1 component)
│   └── 10+ form/editor components
├── views/ (9 main views)
├── stores/ (6 Pinia stores)
├── composables/ (3 composables)
└── lib/ (utilities)
```

### Svelte Component Structure:

```
apps/front/src/
├── lib/components/ (1 component: ChapterManager)
├── routes/ (fragmenteret routes)
└── apps/cards/src/components/ (10+ components, ikke integreret)
```

## 7. Routing Forskelle

### Vue Router:

- 12 routes med proper navigation
- Route guards for project scoping
- Meta titles og scroll behavior
- Dynamic routes for edit pages

### Svelte Routing:

- Fragmenteret mellem apps
- Mange routes mangler implementering
- Ingen guards eller meta handling
- Redirects i stedet for proper views

## 8. Anbefalinger

### 8.1 Gør cards-vue Kørebar?

**JA, absolut!**

- Vue-implementeringen er næsten komplet og funktionel
- Den viser præcis hvad der mangler i Svelte-versionen
- Kan bruges som reference for alle missing features
- Komponenterne kan genbruges som skabeloner

### 8.2 Kritiske Mangler i Svelte:

1. **Dashboard** - Helt manglende
2. **Scene CRUD** - Kun basic liste
3. **Chapter CRUD** - Kun creation, ingen list/edit/delete
4. **TOC/Story Map** - Placeholder kun
5. **Form Validation** - Ingen
6. **Offline Strategy** - Simpel storage
7. **Navigation** - Fragmenteret og ufuldstændig

### 8.3 Porterings Strategi:

1. **Start med at gøre cards-vue kørebar** for at have en working reference
2. **Port dashboard først** - det er entry point og viser project status
3. **Port scene management** - kernefunktionalitet
4. **Port chapter management** med reordering
5. **Port TOC** til navigation overview
6. **Implementer validation og error handling**
7. **Unified routing** mellem front og cards apps

## 9. Konklusion

Vue-implementeringen er markant mere komplet og moden end Svelte-versionen. Der er tale om en forskel på ~80% funktionalitet. At gøre `cards-vue` kørebar vil give et klart billede af hvad der skal implementeres og kan accelerere porteringsprocessen markant.

Den største udfordring er ikke teknisk (begge bruger Tailwind og moderne patterns), men snarere den massive mængde UI-funktionalitet der skal genbygges i Svelte.
