<script>
  import { status, pending, markOffline, markSynced, setStatus } from '../stores/sync.store.js';
  import { get } from 'svelte/store';
  const online = () => get(status) !== 'offline';

  function apply(forceOffline) {
    try { localStorage.setItem('LC_FORCE_OFFLINE', forceOffline ? '1' : '0'); } catch {}
    if (forceOffline) {
      markOffline();
    } else {
      if (get(pending) > 0) setStatus('idle');
      else markSynced();
    }
  }
  const toggle = () => apply(online());
  const handleNavigatorOnline = () => apply(false);
  const handleNavigatorOffline = () => apply(true);

  if (typeof window !== 'undefined') {
    try { if (localStorage.getItem('LC_FORCE_OFFLINE') === '1') apply(true); } catch {}
    window.addEventListener('online', handleNavigatorOnline);
    window.addEventListener('offline', handleNavigatorOffline);
  }
</script>

<button
  class="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition-colors"
  class:!bg-emerald-600={online()} class:!text-white={online()} class:!border-emerald-700={online()} class:hover:!bg-emerald-700={online()}
  class:bg-gray-600={!online()} class:text-white={!online()} class:border-gray-700={!online()} class:hover:bg-gray-700={!online()}
  aria-pressed={!online()}
  on:click={toggle}
>
  {#if online()} Online {:else} Offline {/if}
</button>

