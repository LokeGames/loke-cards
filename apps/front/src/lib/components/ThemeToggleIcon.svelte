<script lang="ts">
  import { themePreference } from '@loke/ui';
  import { MonitorCog, Moon, Sun } from 'lucide-svelte';

  const currentTheme = $derived(themePreference);
</script>

{#if currentTheme === 'light'}
  <Sun class="h-4 w-4" aria-hidden="true" />
{:else if currentTheme === 'dark'}
  <Moon class="h-4 w-4" aria-hidden="true" />
{:else}
  <MonitorCog class="h-4 w-4" aria-hidden="true" />
{/if}
