import { getDbCore, setDbBackend as coreSetDbBackend, getDbBackend as coreGetDbBackend } from './core.js'

let cached = null

export async function getDb() {
  if (cached) return cached
  if (getDbInWorker()) {
    const { createDbWorkerClient } = await import('./workerClient.js')
    cached = createDbWorkerClient()
    return cached
  }
  cached = await getDbCore()
  return cached
}

export function setDbBackend(name) {
  coreSetDbBackend(name)
  cached = null
}

export function getDbBackend() {
  return coreGetDbBackend()
}

export function setDbInWorker(v) {
  try { localStorage.setItem('LC_DB_IN_WORKER', v ? '1' : '0') } catch {}
  cached = null
}

export function getDbInWorker() {
  try { return localStorage.getItem('LC_DB_IN_WORKER') === '1' || Boolean(import.meta.env.VITE_DB_IN_WORKER) } catch { return false }
}
