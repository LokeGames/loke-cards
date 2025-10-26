<script lang="ts">
  import { createEventDispatcher, type ComponentType } from 'svelte';

  export interface AppSidebarItem {
    id: string;
    label: string;
    href?: string;
    icon?: ComponentType | string;
    onClick?: () => void;
    disabled?: boolean;
    badge?: string;
  }

  export interface AppSidebarSection {
    id: string;
    label?: string;
    items: AppSidebarItem[];
  }

  const {
    sections = [],
    activeItemId = null,
    disabled = false,
  }: {
    sections?: AppSidebarSection[];
    activeItemId?: string | null;
    disabled?: boolean;
  } = $props();

  const dispatch = createEventDispatcher<{
    select: { id: string };
  }>();

  function handleItemActivate(event: MouseEvent, item: AppSidebarItem) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }

    dispatch('select', { id: item.id });
  }
</script>

<aside
  class="flex h-full w-64 flex-col border-r border-gray-200 bg-white px-3 py-4 text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
  data-testid="app-sidebar"
  aria-disabled={disabled ? 'true' : undefined}
>
  <nav class="flex-1 space-y-6 overflow-y-auto">
    {#each sections as section (section.id)}
      <div class="space-y-2">
        {#if section.label}
          <h3 class="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {section.label}
          </h3>
        {/if}
        <div class="space-y-1">
          {#each section.items as item (item.id)}
            {#if item.href}
              <a
                href={item.href}
                class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 {item.disabled ? 'pointer-events-none opacity-50' : ''} {item.id === activeItemId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}"
                aria-current={item.id === activeItemId ? 'page' : undefined}
                onclick={(event) => handleItemActivate(event, item)}
              >
                {#if item.icon}
                  {#if typeof item.icon === 'string'}
                    <span class="flex h-4 w-4 items-center justify-center text-xs font-semibold">
                      {item.icon}
                    </span>
                  {:else}
                    {@const Icon = item.icon}
                    <Icon class="h-4 w-4" aria-hidden="true" />
                  {/if}
                {:else}
                  <span class="h-4 w-4" aria-hidden="true"></span>
                {/if}
                <span class="flex-1 font-medium leading-none">{item.label}</span>
                {#if item.badge}
                  <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-colors group-hover:bg-gray-300 dark:bg-white/10 dark:text-gray-100 dark:group-hover:bg-white/20">
                    {item.badge}
                  </span>
                {/if}
              </a>
            {:else}
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 {item.disabled ? 'pointer-events-none opacity-50' : ''} {item.id === activeItemId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}"
                onclick={(event) => handleItemActivate(event, item)}
              >
                {#if item.icon}
                  {#if typeof item.icon === 'string'}
                    <span class="flex h-4 w-4 items-center justify-center text-xs font-semibold">
                      {item.icon}
                    </span>
                  {:else}
                    {@const Icon = item.icon}
                    <Icon class="h-4 w-4" aria-hidden="true" />
                  {/if}
                {:else}
                  <span class="h-4 w-4" aria-hidden="true"></span>
                {/if}
                <span class="flex-1 font-medium leading-none">{item.label}</span>
                {#if item.badge}
                  <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-colors dark:bg-white/10 dark:text-gray-100">
                    {item.badge}
                  </span>
                {/if}
              </button>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <slot />
</aside>
