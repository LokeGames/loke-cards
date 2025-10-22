<template>
  <button
    class="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition-colors"
    :class="online ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700' : 'bg-gray-600 text-white border-gray-700 hover:bg-gray-700'"
    :aria-pressed="!online"
    @click="toggle()"
  >
    <span v-if="online">Online</span>
    <span v-else>Offline</span>
  </button>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useSyncStore } from '../stores/syncStore'
import { setForceOffline } from '../api/client'

const sync = useSyncStore()

const online = computed(() => sync.status !== 'offline')

function apply(forceOffline) {
  setForceOffline(forceOffline)
  try { localStorage.setItem('LC_FORCE_OFFLINE', forceOffline ? '1' : '0') } catch (_) {}
  if (forceOffline) {
    sync.markOffline()
  } else {
    // If coming back online and there is nothing pending, mark as synced
    if (sync.pending > 0) sync.setStatus('idle')
    else sync.markSynced()
  }
}

function toggle() {
  apply(online.value) // if online -> force offline, else clear
}

function handleNavigatorOnline() {
  // Only auto-apply online if not manually forced offline
  apply(false)
}

function handleNavigatorOffline() {
  apply(true)
}

onMounted(() => {
  try {
    const persisted = localStorage.getItem('LC_FORCE_OFFLINE')
    if (persisted === '1') apply(true)
  } catch (_) {}
  window.addEventListener('online', handleNavigatorOnline)
  window.addEventListener('offline', handleNavigatorOffline)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleNavigatorOnline)
  window.removeEventListener('offline', handleNavigatorOffline)
})
</script>

<style scoped>
</style>
