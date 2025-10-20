# Vue Flow Node Overview for **Loke‑cards**

Design: **Chapters as containers**, **Scenes as nodes**. Each chapter gets its own nodeview; a global overview shows all chapters with inter‑chapter links.

---

## 0) TL;DR — Recommended Architecture

* **Data model**: `Chapter { id, title, … }`, `Scene { id, chapterId, title, body, … }`, `Link { id, sourceSceneId, targetSceneId, type }`.
* **Views**:

  1. **ChapterGraph** (single chapter): renders only that chapter’s scenes + intra‑chapter links.
  2. **GlobalGraph**: renders *all* chapters as **group nodes/containers** with their scenes; includes inter‑chapter links.
* **Libs**: Vue 3, **Vue Flow** (`@vue-flow/core`), add‑ons: `@vue-flow/minimap`, `@vue-flow/background`, **ELK** (`elkjs`) for auto layout.
* **Persistence**: Repository interface (swap in JSONL, SQLite/LibSQL, or HTTP API). Keep node positions in DB for stable layouts; recompute with ELK on demand.

---

## 1) Install & Scaffold

```bash
npm create vue@latest loke-cards-ui
cd loke-cards-ui
npm i @vue-flow/core @vue-flow/minimap @vue-flow/background elkjs pinia
```

Enable Pinia (store) in `main.ts`:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

Basic styles (e.g., in `main.css`):

```css
html, body, #app { height: 100%; margin: 0; }
.vue-flow__node { border-radius: 10px; padding: 8px 10px; }
.chapter-node { background:#f6f9ff; border:1px solid #cfe0ff; }
.scene-node { background:#fff; border:1px solid #ddd; }
```

---

## 2) Data Model & Repository Abstraction

Create a minimal domain and repo interface you can back with JSONL, SQLite/LibSQL, or an API.

```ts
// src/domain/types.ts
export type ID = string

export interface Chapter {
  id: ID
  title: string
  summary?: string
  position?: { x: number; y: number } // optional for global layout
}

export interface Scene {
  id: ID
  chapterId: ID
  title: string
  body?: string
  position?: { x: number; y: number } // for per‑chapter layout
}

export type LinkType = 'jump' | 'condition' | 'return' | 'fork'

export interface Link {
  id: ID
  sourceSceneId: ID
  targetSceneId: ID
  type: LinkType
}

export interface Repo {
  getChapters(): Promise<Chapter[]>
  getScenesByChapterId(chapterId: ID): Promise<Scene[]>
  getLinksByChapterId(chapterId: ID): Promise<Link[]> // intra‑chapter
  getAllScenes(): Promise<Scene[]>
  getAllLinks(): Promise<Link[]> // intra + inter chapter
  // mutations
  upsertChapter(ch: Chapter): Promise<void>
  upsertScene(sc: Scene): Promise<void>
  upsertLink(li: Link): Promise<void>
}
```

### Example: In‑memory / JSON adapter

```ts
// src/data/jsonRepo.ts
import type { Repo, Chapter, Scene, Link, ID } from '@/domain/types'

const chapters: Chapter[] = [
  { id: 'c1', title: 'Prologue' },
  { id: 'c2', title: 'The Gate' },
]

const scenes: Scene[] = [
  { id: 's1', chapterId: 'c1', title: 'Intro' },
  { id: 's2', chapterId: 'c1', title: 'Wake Up' },
  { id: 's3', chapterId: 'c2', title: 'Courtyard' },
]

const links: Link[] = [
  { id: 'l1', sourceSceneId: 's1', targetSceneId: 's2', type: 'jump' }, // intra c1
  { id: 'l2', sourceSceneId: 's2', targetSceneId: 's3', type: 'jump' }, // inter c1→c2
]

export const jsonRepo: Repo = {
  async getChapters() { return chapters },
  async getScenesByChapterId(id: ID) { return scenes.filter(s => s.chapterId === id) },
  async getLinksByChapterId(id: ID) {
    const ids = new Set(scenes.filter(s => s.chapterId === id).map(s => s.id))
    return links.filter(l => ids.has(l.sourceSceneId) && ids.has(l.targetSceneId))
  },
  async getAllScenes() { return scenes },
  async getAllLinks() { return links },
  async upsertChapter(ch) { const i = chapters.findIndex(x=>x.id===ch.id); i>=0? chapters[i]=ch:chapters.push(ch) },
  async upsertScene(sc) { const i = scenes.findIndex(x=>x.id===sc.id); i>=0? scenes[i]=sc:scenes.push(sc) },
  async upsertLink(li) { const i = links.findIndex(x=>x.id===li.id); i>=0? links[i]=li:links.push(li) },
}
```

> Swap `jsonRepo` with a SQLite/LibSQL adapter later; the UI doesn’t change.

---

## 3) Pinia Store: Graph Assembly

```ts
// src/stores/graph.ts
import { defineStore } from 'pinia'
import { jsonRepo as repo } from '@/data/jsonRepo'
import type { Chapter, Scene, Link, ID } from '@/domain/types'

export const useGraphStore = defineStore('graph', {
  state: () => ({
    chapters: [] as Chapter[],
    scenes: [] as Scene[],
    links: [] as Link[],
    loading: false,
  }),
  actions: {
    async loadChapter(chapterId: ID) {
      this.loading = true
      try {
        const [chs, scs, lks] = await Promise.all([
          repo.getChapters(),
          repo.getScenesByChapterId(chapterId),
          repo.getLinksByChapterId(chapterId),
        ])
        this.chapters = chs.filter(c => c.id === chapterId)
        this.scenes = scs
        this.links = lks
      } finally {
        this.loading = false
      }
    },
    async loadGlobal() {
      this.loading = true
      try {
        const [chs, scs, lks] = await Promise.all([
          repo.getChapters(), repo.getAllScenes(), repo.getAllLinks()
        ])
        this.chapters = chs
        this.scenes = scs
        this.links = lks
      } finally {
        this.loading = false
      }
    },
  },
})
```

---

## 4) Vue Flow: Node/Edge Builders

Vue Flow needs **elements** (nodes + edges). We’ll build:

* **Chapter container nodes** in Global view
* **Scene nodes** in both views
* **Edges** from `Link`

```ts
// src/graph/builders.ts
import type { Chapter, Scene, Link } from '@/domain/types'
import type { Node, Edge } from '@vue-flow/core'

export function buildChapterNodes(chapters: Chapter[]): Node[] {
  return chapters.map((c) => ({
    id: `chap-${c.id}`,
    type: 'chapter',
    data: { title: c.title },
    position: c.position ?? { x: 0, y: 0 },
    class: 'chapter-node',
    // Make it a "group" container
    extent: 'parent',
    draggable: true,
    selectable: true,
  }))
}

export function buildSceneNodes(scenes: Scene[], parentChapterId?: string): Node[] {
  return scenes.map((s) => ({
    id: `scene-${s.id}`,
    type: 'scene',
    data: { title: s.title },
    position: s.position ?? { x: 0, y: 0 },
    parentNode: parentChapterId ? `chap-${parentChapterId}` : undefined,
    class: 'scene-node',
  }))
}

export function buildEdges(links: Link[]): Edge[] {
  return links.map((l) => ({
    id: `edge-${l.id}`,
    source: `scene-${l.sourceSceneId}`,
    target: `scene-${l.targetSceneId}`,
    data: { type: l.type },
    animated: l.type === 'jump',
    markerEnd: 'arrowclosed',
  }))
}
```

---

## 5) ChapterGraph.vue (single‑chapter view)

```vue
<!-- src/components/ChapterGraph.vue -->
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view="true" :min-zoom="0.1" :max-zoom="1.5">
    <Background />
    <MiniMap />
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import { useGraphStore } from '@/stores/graph'
import { buildSceneNodes, buildEdges } from '@/graph/builders'

const props = defineProps<{ chapterId: string }>()

const store = useGraphStore()
const nodes = ref([])
const edges = ref([])

watchEffect(async () => {
  await store.loadChapter(props.chapterId)
  nodes.value = buildSceneNodes(store.scenes)
  edges.value = buildEdges(store.links)
})
</script>

<style scoped>
/* Add per‑chapter styling if needed */
</style>
```

> This view only shows scenes and intra‑chapter links.

---

## 6) GlobalGraph.vue (all chapters as containers)

```vue
<!-- src/components/GlobalGraph.vue -->
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view="true" :pan-on-drag="[1,2]" :min-zoom="0.05" :max-zoom="1.5">
    <Background />
    <MiniMap />
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import { useGraphStore } from '@/stores/graph'
import { buildChapterNodes, buildSceneNodes, buildEdges } from '@/graph/builders'

const store = useGraphStore()
const nodes = ref([])
const edges = ref([])

watchEffect(async () => {
  await store.loadGlobal()
  const chNodes = buildChapterNodes(store.chapters)
  const perChapterSceneNodes = store.chapters.flatMap(ch => {
    const scenes = store.scenes.filter(s => s.chapterId === ch.id)
    return buildSceneNodes(scenes, ch.id)
  })
  nodes.value = [...chNodes, ...perChapterSceneNodes]
  edges.value = buildEdges(store.links)
})
</script>
```

> Containers (chapters) are `extent: 'parent'` nodes; their scenes use `parentNode` to live inside them.

---

## 7) Auto‑Layout with ELK (optional but highly recommended)

Use ELK to compute positions when there are no saved coordinates or when user requests “Auto layout”.

```ts
// src/graph/layout.ts
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs'

const elk = new ELK()

const defaultOptions: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.spacing.nodeNode': '40',
}

export async function layoutScenes(nodes: any[], edges: any[]) {
  const elkGraph: ElkNode = {
    id: 'root',
    children: nodes.map(n => ({ id: n.id, width: 180, height: 60 })),
    edges: edges.map(e => ({ id: e.id, sources: [e.source], targets: [e.target] })) as ElkExtendedEdge[],
  }
  const res = await elk.layout(elkGraph, { layoutOptions: defaultOptions })
  const posById = new Map(res.children?.map(c => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]))
  return nodes.map(n => ({ ...n, position: posById.get(n.id) ?? n.position }))
}
```

Integrate in views (e.g., in `ChapterGraph.vue`) after loading:

```ts
import { layoutScenes } from '@/graph/layout'

watchEffect(async () => {
  await store.loadChapter(props.chapterId)
  const n = buildSceneNodes(store.scenes)
  const e = buildEdges(store.links)
  nodes.value = await layoutScenes(n, e) // positions filled by ELK
  edges.value = e
})
```

> Persist positions back to `Repo` (e.g., on drag‑end) so the graph remains stable across sessions.

---

## 8) Node Templates (custom Vue components)

Register custom node types to display rich content (status, tags, AI metadata).

```ts
// src/graph/nodeTypes.ts
import SceneNode from '@/nodes/SceneNode.vue'
import ChapterNode from '@/nodes/ChapterNode.vue'

export const nodeTypes = {
  scene: SceneNode,
  chapter: ChapterNode,
}
```

Use in graphs:

```vue
<VueFlow :node-types="nodeTypes" ...>
```

`SceneNode.vue` example:

```vue
<template>
  <div class="scene-node">
    <strong>{{ data.title }}</strong>
    <div class="muted">{{ data.subtitle }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ id: string; data: { title: string; subtitle?: string } }>()
</script>
```

---

## 9) Interaction & Persistence

* **Drag/Drop**: listen to `node-drag-stop` and persist `position` via `repo.upsertScene()` or chapter position via `repo.upsertChapter()`.
* **Create Scene**: click in canvas → open modal → create `Scene` and (optionally) a `Link` from the selected scene.
* **Delete**: keyboard `Del` → remove node/edge; reflect in repo.

```vue
<VueFlow @node-drag-stop="onDragStop" @connect="onConnect" @nodes-delete="onNodesDelete"/>
```

```ts
async function onDragStop(evt) {
  const n = evt.node
  if (n.type === 'scene') {
    await repo.upsertScene({ id: n.id.replace('scene-',''), chapterId: findChapterId(n), title: n.data.title, position: n.position })
  } else if (n.type === 'chapter') {
    await repo.upsertChapter({ id: n.id.replace('chap-',''), title: n.data.title, position: n.position })
  }
}

async function onConnect(params) {
  // params: { source, target }
  const sourceId = params.source.replace('scene-','')
  const targetId = params.target.replace('scene-','')
  await repo.upsertLink({ id: crypto.randomUUID(), sourceSceneId: sourceId, targetSceneId: targetId, type: 'jump' })
}
```

---

## 10) Routing Between Views

Use Vue Router to switch between **per‑chapter** and **global** graphs.

```ts
// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import ChapterGraph from '@/components/ChapterGraph.vue'
import GlobalGraph from '@/components/GlobalGraph.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: GlobalGraph },
    { path: '/chapter/:id', component: ChapterGraph, props: true },
  ],
})
```

Add navigation (sidebar with chapter list) to jump into `ChapterGraph`.

---

## 11) Edge Styling & Semantics

Map `Link.type` → edge style:

* `jump`: animated arrow
* `condition`: dashed
* `return`: reversed marker
* `fork`: bold stroke

In Vue Flow edges, set `style`, `animated`, `markerEnd`, `label` from `link.type`.

---

## 12) Performance Tips

* Use **per‑chapter** view for daily editing (keeps DOM small).
* **Virtualize** long lists (sidebars) and lazy‑load node details.
* Debounce drag events before persisting.
* For massive worlds, paginate scenes per chapter (`?page=…`) or render summaries until zoomed in.

---

## 13) Persisting Positions (crucial for UX)

Add a small helper to capture and store node positions anytime the layout changes:

```ts
import type { Node } from '@vue-flow/core'

export function extractPositions(nodes: Node[]) {
  return nodes.map(n => ({ id: n.id, position: n.position }))
}
```

Call after ELK layout **and** after drags; write back to repo. This ensures minimal flicker across sessions.

---

## 14) Testing the Graph

* Create fixtures with 2–3 chapters and 10–20 scenes each.
* Assert that per‑chapter views only contain that chapter’s scenes.
* Assert inter‑chapter edges appear only in **GlobalGraph**.
* Snapshot tests for node counts and edge counts.

---

## 15) Why per‑chapter + global is the smartest split

* **Focus**: Writers work in small, cognitively manageable graphs.
* **Scale**: Global overview stays useful (chapters as containers) without flooding the canvas.
* **Performance**: DOM stays light; layout computations are bounded.
* **Navigation**: Global map → double‑click chapter → deep‑dive editor.

---

## 16) Next Steps

* Add **search/filter** (by tags, speaker, variable use).
* Add **validation** (dangling scenes, cycles, unreachable nodes).
* Expose an **export** to Loke‑engine JSONL format.
* Optional: **Command palette** (quick create scene, link, jump to node).
* Optional: **AI assist**: propose next scenes, autolink by keywords.

---

### Appendix A — Minimal Loke‑engine JSONL Export Sketch

```json
{"type":"chapter","id":"c1","title":"Prologue"}
{"type":"scene","id":"s1","chapterId":"c1","title":"Intro"}
{"type":"scene","id":"s2","chapterId":"c1","title":"Wake Up"}
{"type":"link","id":"l1","source":"s1","target":"s2","linkType":"jump"}
```

### Appendix B — Styling Hints

* Chapter container: larger padding; sticky header with chapter title.
* Scene node: title + 1–2 badges (status, wordcount).
* Use a subtle **grid background** to improve spatial memory.

---

**You’re set.** This skeleton lets you plug any storage layer in, keep per‑chapter editors fast, and provide a global map for planning.
