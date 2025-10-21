// sql.js adapter (WASM). Attempts to load sql.js if available; otherwise throws.
// Usage: place sql-wasm.js and sql-wasm.wasm in /public/sqljs/ and expose window.initSqlJs

let SQL = null
let autosave = false
const OPFS_FILE = 'cards.db'

function getAutosaveFlag() {
  try { return localStorage.getItem('LC_SQLJS_AUTOSAVE') === '1' } catch { return false }
}

async function loadSqlJs() {
  if (SQL) return SQL
  // Try global first
  if (typeof window !== 'undefined' && window.initSqlJs) {
    SQL = await window.initSqlJs({ locateFile: (f) => `/sqljs/${f}` })
    return SQL
  }
  // Try dynamic import (if bundled)
  try {
    const mod = await import(/* @vite-ignore */ '/sqljs/sql-wasm.js')
    SQL = await mod.default({ locateFile: (f) => `/sqljs/${f}` })
    return SQL
  } catch (e) {
    throw new Error('SQL.js not available. Place sql-wasm.js/wasm under /public/sqljs/')
  }
}

export async function createSqlJsAdapter() {
  const SQLJS = await loadSqlJs()
  autosave = getAutosaveFlag()

  // Try to load persisted DB from OPFS if available
  const persisted = await tryLoadFromOPFS()
  const db = persisted ? new SQLJS.Database(persisted) : new SQLJS.Database()

  // Minimal schema if not exists
  db.exec(`CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT);
           CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT);`)

  let savePending = false
  async function maybeAutosave() {
    if (!autosave) return
    if (savePending) return
    savePending = true
    // debounce
    setTimeout(async () => {
      try { await saveToOPFS(db) } catch (e) { console.warn('[SQLJS] autosave failed', e) }
      savePending = false
    }, 150)
  }

  const adapter = {
    async scenesList() {
      const res = db.exec(`SELECT data FROM scenes ORDER BY id`)
      const rows = res[0]?.values || []
      return rows.map(([json]) => { try { return JSON.parse(json) } catch { return null } }).filter(Boolean)
    },
    async scenesGet(id) {
      const stmt = db.prepare(`SELECT data FROM scenes WHERE id = ?`)
      try {
        stmt.bind([id])
        if (stmt.step()) {
          const row = stmt.getAsObject().data
          try { return JSON.parse(row) } catch { return null }
        }
        return null
      } finally { stmt.free() }
    },
    async scenesPut(scene) {
      const id = scene.sceneId || scene.id
      if (!id) throw new Error('sceneId required')
      const json = JSON.stringify({ ...scene, id, sceneId: id })
      const stmt = db.prepare(`INSERT INTO scenes (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data`)
      try { stmt.run([id, json]) } finally { stmt.free() }
      await maybeAutosave()
      return scene
    },
    async scenesDelete(id) {
      const stmt = db.prepare(`DELETE FROM scenes WHERE id=?`)
      try { stmt.run([id]) } finally { stmt.free() }
      await maybeAutosave()
    },
    async chaptersList() {
      const res = db.exec(`SELECT data FROM chapters ORDER BY id`)
      const rows = res[0]?.values || []
      return rows.map(([json]) => { try { return JSON.parse(json) } catch { return null } }).filter(Boolean)
    },
    async chaptersGet(id) {
      const stmt = db.prepare(`SELECT data FROM chapters WHERE id = ?`)
      try {
        stmt.bind([id])
        if (stmt.step()) {
          const row = stmt.getAsObject().data
          try { return JSON.parse(row) } catch { return null }
        }
        return null
      } finally { stmt.free() }
    },
    async chaptersPut(ch) {
      const id = ch.id
      if (!id) throw new Error('chapter id required')
      const json = JSON.stringify(ch)
      const stmt = db.prepare(`INSERT INTO chapters (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data`)
      try { stmt.run([id, json]) } finally { stmt.free() }
      await maybeAutosave()
      return ch
    },
    async chaptersDelete(id) {
      const stmt = db.prepare(`DELETE FROM chapters WHERE id=?`)
      try { stmt.run([id]) } finally { stmt.free() }
      await maybeAutosave()
    },
    async flush() { try { await saveToOPFS(db) } catch (e) { console.warn('[SQLJS] flush failed', e) } },
  }

  return adapter
}

async function tryLoadFromOPFS() {
  try {
    if (!('storage' in navigator) || !navigator.storage?.getDirectory) return null
    const root = await navigator.storage.getDirectory()
    const handle = await root.getFileHandle(OPFS_FILE, { create: false }).catch(() => null)
    if (!handle) return null
    const file = await handle.getFile()
    const buf = await file.arrayBuffer()
    return new Uint8Array(buf)
  } catch { return null }
}

async function saveToOPFS(db) {
  try {
    if (!('storage' in navigator) || !navigator.storage?.getDirectory) return false
    const root = await navigator.storage.getDirectory()
    const handle = await root.getFileHandle(OPFS_FILE, { create: true })
    const writable = await handle.createWritable()
    const data = db.export()
    await writable.write(data)
    await writable.close()
    return true
  } catch (e) {
    console.warn('[SQLJS] OPFS persist not available or failed', e)
    return false
  }
}
