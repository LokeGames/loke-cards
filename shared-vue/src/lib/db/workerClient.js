export function createDbWorkerClient() {
  const worker = new Worker(new URL('../../workers/db.worker.js', import.meta.url), { type: 'module' })
  let nextId = 1
  const pending = new Map()

  worker.onmessage = (e) => {
    const { id, ok, result, error } = e.data || {}
    const p = pending.get(id)
    if (!p) return
    pending.delete(id)
    if (ok) p.resolve(result)
    else p.reject(new Error(error || 'Worker error'))
  }

  function call(method, args) {
    const id = nextId++
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      worker.postMessage({ id, method, args })
    })
  }

  return {
    // Scenes
    scenesList: () => call('scenesList', []),
    scenesGet: (id) => call('scenesGet', [id]),
    scenesPut: (scene) => call('scenesPut', [scene]),
    scenesDelete: (id) => call('scenesDelete', [id]),
    // Chapters
    chaptersList: () => call('chaptersList', []),
    chaptersGet: (id) => call('chaptersGet', [id]),
    chaptersPut: (ch) => call('chaptersPut', [ch]),
    chaptersDelete: (id) => call('chaptersDelete', [id]),
  }
}

