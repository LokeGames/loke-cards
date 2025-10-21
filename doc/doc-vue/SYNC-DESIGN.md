# Offline‑First Sync Design (Single‑User)

Goals:
- PWA works fully offline (mobile). When back online, changes sync to server SQLite.
- Single‑user => simple last‑write‑wins (LWW) is acceptable.

## Data Model
- scenes: `{ id, data: { …full scene… }, updatedAt: epoch_ms, deleted: bool }`
- chapters: `{ id, data: { … }, updatedAt, deleted }`

Server stores the same shape in SQLite (JSON inside `data` column for dev simplicity).

## Flow
1) User edits locally → mark row dirty (set `updatedAt = now`, `deleted=false`).
2) Sync trigger: on app focus, periodic timer, online event, or Background Sync.
3) Push: POST `/api/changes` with arrays of dirty scenes/chapters
   - Server upserts by id; sets `updatedAt`; accepts `deleted` tombstones.
4) Pull: GET `/api/changes?since=<lastSync>` to fetch deltas from server
5) Merge: locally apply LWW by comparing `updatedAt`; if `deleted=true`, remove or mark as tombstone.
6) Set `lastSync` when both push/pull complete.

## API Sketch
```
GET /api/changes?since=1700000000000
{
  "scenes": [{"id":"scene_x","data":{...},"updatedAt":1700000001111,"deleted":false}],
  "chapters": [...]
}

POST /api/changes
{
  "scenes": [{"id":"scene_x","data":{...},"updatedAt":1700000001111,"deleted":false}],
  "chapters": [...]
}
→ 200 { ok: true, applied: { scenes: n, chapters: m } }
```

## Client
- Pinia `syncStore`: tracks `lastSync`, dirty sets, status.
- DB adapter: start with LocalForage; later add WASM SQLite behind feature flag.
- Service Worker: cache app‑shell + Background Sync (Workbox) for enqueue/push.

## Conflict Strategy
- Single‑user: LWW by `updatedAt` is acceptable.
- Multi‑user later: introduce per‑field merge or CRDT if needed.

## Testing
- Playwright offline/online toggle; create/edit while offline; assert merged state after online.
- Unit tests for merge logic (if extracted as pure functions).

