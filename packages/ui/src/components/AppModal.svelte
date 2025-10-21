<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let open: boolean = false;
  export let title: string = '';
  export let confirmText: string = 'Confirm';
  export let cancelText: string = 'Cancel';
  const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();
  const onConfirm = () => dispatch('confirm');
  const onCancel = () => dispatch('cancel');
</script>

{#if open}
  <div class="fixed inset-0 z-40 bg-black/50" role="button" tabindex="0" aria-label="Close modal overlay" on:click={onCancel} on:keydown={(e) => e.key==='Escape' && onCancel()}></div>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {#if title}
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium">{title}</div>
      {/if}
      <div class="p-4">
        <slot />
      </div>
      <div class="px-4 py-2 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
        <button class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800" on:click={onCancel}>{cancelText}</button>
        <button class="px-3 py-1 rounded bg-blue-600 text-white" on:click={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

