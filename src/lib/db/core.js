import { createLocalAdapter } from './local.js'

let cachedCore = null

export function wantSqlJs() {
  try {
    const pref = (typeof localStorage !== 'undefined' && localStorage.getItem('LC_DB_BACKEND')) || ''
    if (pref.toLowerCase() === 'sqljs') return true
  } catch {}
  return Boolean((typeof window !== 'undefined' && window.__USE_SQLJS) || import.meta.env.VITE_USE_SQLJS)
}

export function setDbBackend(name) {
  try { localStorage.setItem('LC_DB_BACKEND', String(name || 'local')) } catch {}
  cachedCore = null
}

export function getDbBackend() {
  try { return localStorage.getItem('LC_DB_BACKEND') || 'local' } catch { return 'local' }
}

export async function getDbCore() {
  if (cachedCore) return cachedCore
  if (wantSqlJs()) {
    try {
      const { createSqlJsAdapter } = await import('./sqljs.js')
      cachedCore = await createSqlJsAdapter()
      return cachedCore
    } catch (e) {
      console.warn('[DB] SQL.js unavailable, falling back to LocalForage adapter:', e)
    }
  }
  cachedCore = createLocalAdapter()
  return cachedCore
}

