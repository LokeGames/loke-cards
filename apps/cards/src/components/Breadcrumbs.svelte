<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export type Crumb = { label: string; href?: string };
  export let items: Crumb[] = [];
  const dispatch = createEventDispatcher<{ navigate: { href: string } }>();
  function nav(href?: string) {
    if (href) dispatch('navigate', { href });
  }
</script>

<nav aria-label="Breadcrumb" class="text-sm text-gray-600 dark:text-gray-300 py-1">
  {#each items as c, i}
    <span class="inline-flex items-center">
      {#if c.href}
        <button class="underline hover:no-underline" on:click={() => nav(c.href)}>{c.label}</button>
      {:else}
        <span aria-current="page">{c.label}</span>
      {/if}
      {#if i < items.length - 1}
        <span class="px-2 text-gray-400">/</span>
      {/if}
    </span>
  {/each}
  {#if !items?.length}
    <span>Home</span>
  {/if}
  
</nav>

