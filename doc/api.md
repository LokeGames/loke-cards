# Cards ↔ Graph In‑Browser API (Source of Truth)

This document defines the canonical API for the Graph app to consume data and project context from the Cards app entirely in the browser (offline‑first). No backend coupling is required.

## Project Context

- Active project ID is persisted in `localStorage` under key `LC_PROJECT_ID`.
- Cards emits a CustomEvent `lc:project-change` on project changes.
- Helpers (importable from Cards):
  - `import { onProjectChange } from '@cards/lib/events.js'`
  - Usage: `const off = onProjectChange((detail) => { /* reload data */ })`

## Data Change Events

- Cards emits a CustomEvent `lc:data-change` on local CRUD operations.
- Helpers (importable from Cards):
  - `import { onDataChange } from '@cards/lib/events.js'`
  - Usage: `const off = onDataChange((detail) => { /* refresh lists */ })`
- Event detail may include `{ entity: 'scene'|'chapter', action: 'upsert'|'delete', id, projectId }`.

## Database Adapter

Cards exposes a DB adapter with a stable interface. Internally it can use LocalForage (IndexedDB) or SQL.js (WASM), and can run in a Web Worker.

- Import: `import { getDb, getDbBackend, setDbBackend, getDbInWorker, setDbInWorker } from '@cards/lib/db/index.js'`

### Adapter Methods

All methods return Promises.

Scenes
- `scenesList(): Promise<Scene[]>`
- `scenesGet(id: string): Promise<Scene|null>`
- `scenesPut(scene: Scene): Promise<Scene>`
- `scenesDelete(id: string): Promise<void>`

Chapters
- `chaptersList(): Promise<Chapter[]>`
- `chaptersGet(id: string): Promise<Chapter|null>`
- `chaptersPut(chapter: Chapter): Promise<Chapter>`
- `chaptersDelete(id: string): Promise<void>`

Notes
- Scene objects should include `sceneId` (canonical), `id` mirroring `sceneId`, `chapterId`, and `projectId` (for scoping).
- Chapter objects should include `id`, `name`, and `projectId`.

### Backend Selection

- `getDbBackend()` returns `'local'` (LocalForage) or `'sqljs'` (SQL.js/WASM).
- `setDbBackend('local'|'sqljs')` persists preference and invalidates cache (app should reload).
- `getDbInWorker()` returns boolean indicating whether DB runs in a Web Worker.
- `setDbInWorker(true|false)` persists preference and invalidates cache (app should reload).

### SQL.js (WASM) Assets

- Place `sql-wasm.js` and `sql-wasm.wasm` under `/public/sqljs/`.
- At runtime, Cards will auto‑detect `window.initSqlJs` when available.

## Example (Graph)

```js
import { defineStore } from 'pinia'
import { getDb } from '@cards/lib/db/index.js'
import { onProjectChange, onDataChange } from '@cards/lib/events.js'

function pid() { try { return localStorage.getItem('LC_PROJECT_ID') || 'default' } catch { return 'default' } }

export const useGraphStore = defineStore('graph', {
  state: () => ({ chapters: [], scenes: [], loading: false }),
  actions: {
    async load() {
      this.loading = true
      try {
        const db = await getDb()
        const [chs, scs] = await Promise.all([db.chaptersList(), db.scenesList()])
        const p = pid()
        this.chapters = (chs || []).filter(c => (c.projectId || 'default') === p)
        this.scenes = (scs || []).filter(s => (s.projectId || 'default') === p)
      } finally { this.loading = false }
    },
    subscribeLive() {
      const off1 = onProjectChange(() => this.load())
      const off2 = onDataChange((detail) => {
        const p = pid()
        if (!detail || !detail.projectId || detail.projectId === p) this.load()
      })
      return () => { try { off1 && off1(); off2 && off2(); } catch {} }
    }
  }
})
```

## Graph Client Helper

For convenience, Cards exposes a small helper that bundles project scoping + DB access.

- Import: `import { createGraphClient, getActiveProjectId } from '@cards/lib/api/graphClient.js'`
- API:
  - `listAll()` → `{ projectId, chapters, scenes }` (scoped to active project)
  - `subscribe(onChange)` → unsubscribe function; listens to project/data changes
  - `upsertScene(scene)`, `deleteScene(id)`
  - `upsertChapter(chapter)`, `deleteChapter(id)`

Minimal usage:
```js
const client = createGraphClient()
const { projectId, chapters, scenes } = await client.listAll()
const off = client.subscribe(async () => {
  const next = await client.listAll()
  // update local store/state with next.chapters/next.scenes
})
```

## Versioning

- This API is considered stable for internal integration between Cards and Graph.
- Breaking changes will be reflected here and require coordinated updates.
