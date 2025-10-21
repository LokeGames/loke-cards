<template>
  <span
    class="text-sm px-3 py-1 rounded-full"
    :class="{
      'bg-green-500 text-white': effectiveState === 'synced',
      'bg-blue-500 text-white': effectiveState === 'syncing',
      'bg-yellow-500 text-white': effectiveState === 'idle',
      'bg-red-500 text-white': effectiveState === 'error',
      'bg-gray-500 text-white': effectiveState === 'offline',
    }"
    :title="tooltip"
  >
    {{ label }}
  </span>
  
</template>

<script setup>
import { computed } from 'vue'
import { useSyncStore } from '../stores/syncStore'

const props = defineProps({
  state: { type: String, required: false },
})

const sync = useSyncStore()

const effectiveState = computed(() => props.state || sync.status || 'idle')
const label = computed(() => {
  const pending = Number(sync.pending || 0)
  switch (effectiveState.value) {
    case 'synced':
      return pending > 0 ? `Pending ${pending}` : 'Synced'
    case 'syncing':
      return pending > 0 ? `Syncing… ${pending}` : 'Syncing…'
    case 'offline':
      return 'Offline'
    case 'error':
      return 'Sync error'
    default:
      return pending > 0 ? `Pending ${pending}` : 'Idle'
  }
})

const tooltip = computed(() => {
  if (effectiveState.value === 'synced' && sync.lastSync) {
    const d = new Date(sync.lastSync)
    return `Last sync: ${d.toLocaleString()}`
  }
  if (effectiveState.value === 'error' && sync.error) {
    return String(sync.error)
  }
  return 'Sync status'
})
</script>

<style scoped>
/* Add any component specific styles here */
</style>
