<script lang="ts">
  import { onMount } from 'svelte';
  let dark: boolean = false;
  const apply = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.theme = dark ? 'dark' : 'light'; } catch {}
  };
  onMount(() => {
    try {
      dark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {}
    apply();
  });
  const toggle = () => { dark = !dark; apply(); };
</script>

<button on:click={toggle} class="px-2 py-1 rounded border border-gray-200 dark:border-gray-700" aria-label="Toggle theme">
  {#if dark}🌙{:else}☀️{/if}
</button>
