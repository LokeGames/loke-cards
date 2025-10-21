<script lang="ts">
  import AppHeader from '@shared/lib/components/AppHeader.svelte';
  import Breadcrumbs, { type Crumb } from './Breadcrumbs.svelte';
  import { createEventDispatcher } from 'svelte';
  export let title: string = 'Cards';
  export let breadcrumbs: Crumb[] = [];
  const dispatch = createEventDispatcher<{ back: void; breadcrumb: { href: string } }>();
  function onBack() { dispatch('back'); }
</script>

<div class="px-4 pt-2">
  <Breadcrumbs items={breadcrumbs} on:navigate={(e) => dispatch('breadcrumb', e.detail)} />
</div>
<div class="flex items-center gap-2 px-4">
  <button class="px-2 py-1 rounded border border-gray-200 dark:border-gray-700" aria-label="Back" on:click={onBack}>Back</button>
</div>
<AppHeader {title} />
