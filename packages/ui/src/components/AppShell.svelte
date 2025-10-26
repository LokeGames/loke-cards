<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TopNavBar, {
    type TopNavActionItem,
    type TopNavModuleItem,
  } from './TopNavBar.svelte';

  const {
    modules = [],
    actions = [],
    activeModuleId = null,
    navHidden = false,
  }: {
    modules?: TopNavModuleItem[];
    actions?: TopNavActionItem[];
    activeModuleId?: string | null;
    navHidden?: boolean;
  } = $props();

  const dispatch = createEventDispatcher<{
    selectModule: { id: string };
    action: { id: string };
  }>();

  function handleModuleSelect(event: CustomEvent<{ id: string }>) {
    dispatch('selectModule', event.detail);
  }

  function handleAction(event: CustomEvent<{ id: string }>) {
    dispatch('action', event.detail);
  }
</script>

<div class="flex h-screen w-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
  <header class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="px-4 py-3">
      <slot name="header" />
    </div>
    {#if !navHidden}
      <TopNavBar
        {modules}
        {actions}
        {activeModuleId}
        on:select={handleModuleSelect}
        on:action={handleAction}
      />
    {/if}
  </header>

  <main class="flex-1 overflow-hidden">
    <slot />
  </main>
</div>
