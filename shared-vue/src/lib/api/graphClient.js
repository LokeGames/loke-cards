// Graph Client Helper — convenience wrapper for Graph to consume Cards' in‑browser DB
import { getDb } from '../db/index.js'
import { onProjectChange, onDataChange } from '../events.js'

export function getActiveProjectId() {
  try { return localStorage.getItem('LC_PROJECT_ID') || 'default' } catch { return 'default' }
}

function scopeByProject(arr, pid) {
  return (arr || []).filter((x) => (x?.projectId || 'default') === pid)
}

export function createGraphClient() {
  async function listAll() {
    const db = await getDb()
    const pid = getActiveProjectId()
    const [chapters, scenes] = await Promise.all([
      db.chaptersList(),
      db.scenesList(),
    ])
    return { projectId: pid, chapters: scopeByProject(chapters, pid), scenes: scopeByProject(scenes, pid) }
  }

  function subscribe(onChange) {
    const off1 = onProjectChange(() => onChange && onChange({ type: 'project' }))
    const off2 = onDataChange((detail) => onChange && onChange({ type: 'data', detail }))
    return () => { try { off1 && off1(); off2 && off2(); } catch {} }
  }

  async function upsertScene(scene) {
    const db = await getDb()
    const pid = getActiveProjectId()
    const payload = { projectId: pid, ...scene }
    return db.scenesPut(payload)
  }
  async function deleteScene(id) {
    const db = await getDb()
    return db.scenesDelete(id)
  }
  async function upsertChapter(chapter) {
    const db = await getDb()
    const pid = getActiveProjectId()
    const payload = { projectId: pid, ...chapter }
    return db.chaptersPut(payload)
  }
  async function deleteChapter(id) {
    const db = await getDb()
    return db.chaptersDelete(id)
  }

  return {
    getActiveProjectId,
    listAll,
    subscribe,
    upsertScene,
    deleteScene,
    upsertChapter,
    deleteChapter,
  }
}

