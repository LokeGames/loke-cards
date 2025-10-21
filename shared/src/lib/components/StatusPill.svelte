<script>
  import { status, pending, lastSync, error } from '../stores/sync.store.js';
  export let state = undefined;
  $: effective = state || $status || 'idle';
  $: label = (() => {
    const p = Number($pending || 0);
    switch (effective) {
      case 'synced': return p > 0 ? `Pending ${p}` : 'Synced';
      case 'syncing': return p > 0 ? `Syncing… ${p}` : 'Syncing…';
      case 'offline': return 'Offline';
      case 'error': return 'Sync error';
      default: return p > 0 ? `Pending ${p}` : 'Idle';
    }
  })();
  $: tooltip = (() => {
    if (effective === 'synced' && $lastSync) {
      const d = new Date($lastSync);
      return `Last sync: ${d.toLocaleString()}`;
    }
    if (effective === 'error' && $error) return String($error);
    return 'Sync status';
  })();
</script>

<span
  class="text-sm px-3 py-1 rounded-full"
  class:bg-green-500={effective==='synced'}
  class:bg-blue-500={effective==='syncing'}
  class:bg-yellow-500={effective==='idle'}
  class:bg-red-500={effective==='error'}
  class:bg-gray-500={effective==='offline'}
  class:text-white
  title={tooltip}
>
  {label}
</span>

