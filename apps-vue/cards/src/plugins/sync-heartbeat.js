import { forceHealthCheck } from '@cards/api/client'
import { useSyncStore } from '@cards/stores/syncStore'

export function startSyncHeartbeat(pinia, { intervalMs = 2000 } = {}) {
  const sync = useSyncStore(pinia)
  async function tick() {
    const healthy = await forceHealthCheck()
    if (healthy) {
      if (sync.pending > 0) {
        sync.setStatus('idle')
      } else if (sync.status === 'offline' || sync.status === 'error' || sync.status === 'idle') {
        sync.markSynced()
      }
    } else {
      sync.markOffline()
    }
  }
  // Kick once immediately, then interval
  tick()
  const id = setInterval(tick, intervalMs)
  return () => clearInterval(id)
}

