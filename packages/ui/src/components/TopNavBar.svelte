<script lang="ts">
  import { createEventDispatcher, type ComponentType } from 'svelte';

  export interface TopNavModuleItem {
    id: string;
    label: string;
    icon?: ComponentType;
    href: string;
    disabled?: boolean;
  }

  export interface TopNavActionItem {
    id: string;
    label: string;
    icon?: ComponentType;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  }

  const {
    modules = [],
    actions = [],
    activeModuleId = null,
  }: {
    modules?: TopNavModuleItem[];
    actions?: TopNavActionItem[];
    activeModuleId?: string | null;
  } = $props();

  const dispatch = createEventDispatcher<{
    select: { id: string };
    action: { id: string };
  }>();

  function handleModuleSelect(moduleId: string) {
    dispatch('select', { id: moduleId });
  }

  function onModuleClick(event: MouseEvent, module: TopNavModuleItem) {
    if (module.disabled) {
      event.preventDefault();
      return;
    }
    handleModuleSelect(module.id);
  }

  function handleActionTrigger(action: TopNavActionItem) {
    if (action.disabled) {
      return;
    }
    if (action.onClick) {
      action.onClick();
    }
    dispatch('action', { id: action.id });
  }

  function onActionLinkClick(event: MouseEvent, action: TopNavActionItem) {
    if (action.disabled) {
      event.preventDefault();
      return;
    }
    handleActionTrigger(action);
  }
</script>

<div class="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900">
  <nav class="flex items-center gap-1">
    {#each modules as module (module.id)}
      {#if module.href}
        <a
          href={module.href}
          aria-current={module.id === activeModuleId ? 'page' : undefined}
          class="flex items-center gap-2 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 {module.id === activeModuleId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'} {module.disabled ? 'pointer-events-none opacity-50' : ''}"
          onclick={(event) => onModuleClick(event, module)}
        >
          {#if module.icon}
            {@const Icon = module.icon}
            <Icon class="h-4 w-4" aria-hidden="true" />
          {/if}
          <span class="font-medium">{module.label}</span>
        </a>
      {:else}
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 {module.id === activeModuleId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'} {module.disabled ? 'pointer-events-none opacity-50' : ''}"
          onclick={() => {
            if (!module.disabled) {
              handleModuleSelect(module.id);
            }
          }}
        >
          {#if module.icon}
            {@const Icon = module.icon}
            <Icon class="h-4 w-4" aria-hidden="true" />
          {/if}
          <span class="font-medium">{module.label}</span>
        </button>
      {/if}
    {/each}
  </nav>

  {#if actions.length > 0}
    <div class="flex items-center gap-1">
      {#each actions as action (action.id)}
        {#if action.href}
        <a
          href={action.href}
          class="flex items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-900 {action.disabled ? 'pointer-events-none opacity-50' : ''}"
          onclick={(event) => onActionLinkClick(event, action)}
        >
          {#if action.icon}
            {@const Icon = action.icon}
            <Icon class="h-4 w-4" aria-hidden="true" />
          {/if}
          <span class="sr-only">{action.label}</span>
        </a>
      {:else}
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-900 {action.disabled ? 'pointer-events-none opacity-50' : ''}"
          onclick={() => handleActionTrigger(action)}
        >
          {#if action.icon}
            {@const Icon = action.icon}
            <Icon class="h-4 w-4" aria-hidden="true" />
          {/if}
          <span class="sr-only">{action.label}</span>
        </button>
      {/if}
      {/each}
    </div>
  {/if}
</div>
