<script lang="ts">
  import { status, pending, lastSync, error } from '../stores/sync.store';
  export let state: 'synced' | 'syncing' | 'idle' | 'offline' | 'error' | undefined = undefined;
  let effective: 'synced' | 'syncing' | 'idle' | 'offline' | 'error';
  let label: string;
  let tooltip: string;
  let p = 0;
  $: p = Number($pending || 0);
  $: effective = (state || $status || 'idle');
  $: {
    if (effective === 'synced') label = p > 0 ? `Pending ${p}` : 'Synced';
    else if (effective === 'syncing') label = p > 0 ? `Syncing… ${p}` : 'Syncing…';
    else if (effective === 'offline') label = 'Offline';
    else if (effective === 'error') label = 'Sync error';
    else label = p > 0 ? `Pending ${p}` : 'Idle';
  }
  $: {
    if (effective === 'synced' && $lastSync) {
      const d = new Date($lastSync);
      tooltip = `Last sync: ${d.toLocaleString()}`;
    } else if (effective === 'error' && $error) {
      tooltip = String($error);
    } else tooltip = 'Sync status';
  }
</script>

<span
  class="text-sm px-3 py-1 rounded-full text-white"
  class:bg-green-500={effective==='synced'}
  class:bg-blue-500={effective==='syncing'}
  class:bg-yellow-500={effective==='idle'}
  class:bg-red-500={effective==='error'}
  class:bg-gray-500={effective==='offline'}
  title={tooltip}
>
  {label}
</span>
