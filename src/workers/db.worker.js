// DB Worker: routes RPC calls to core DB (LocalForage or SQL.js) off the UI thread
import { getDbCore } from '../lib/db/core.js'

let dbPromise = null
function getDb() {
  dbPromise = dbPromise || getDbCore()
  return dbPromise
}

self.onmessage = async (e) => {
  const { id, method, args } = e.data || {}
  try {
    const db = await getDb()
    const fn = db?.[method]
    if (typeof fn !== 'function') throw new Error(`Unknown method: ${method}`)
    const result = await fn.apply(db, args || [])
    self.postMessage({ id, ok: true, result })
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err?.message || err) })
  }
}

