<script>
  import { toasts, removeToast } from '../stores/toast.store.js';
</script>

<div class="fixed z-50 bottom-4 right-4 space-y-2">
  {#each $toasts as t}
    <div class="px-3 py-2 rounded shadow text-white"
      class:bg-blue-600={t.type==='info'}
      class:bg-green-600={t.type==='success'}
      class:bg-yellow-600={t.type==='warn'}
      class:bg-red-600={t.type==='error'}
    >
      <div class="flex items-start gap-2">
        <div class="flex-1">{t.message}</div>
        <button class="opacity-80 hover:opacity-100" on:click={() => removeToast(t.id)}>×</button>
      </div>
    </div>
  {/each}
</div>

