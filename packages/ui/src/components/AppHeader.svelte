<script lang="ts">
  export let title: string = '';
  
  let theme: 'light' | 'dark' | 'system' = 'system';
  
  // Initialize theme from localStorage or system preference
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    theme = stored || 'system';
    updateTheme();
  }
  
  function updateTheme() {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
      } else {
        root.classList.toggle('dark', theme === 'dark');
      }
      
      localStorage.setItem('theme', theme);
    }
  }
  
  function toggleTheme() {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    theme = themes[(currentIndex + 1) % themes.length];
    updateTheme();
  }
  
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
  }
</script>

<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
  <div class="flex items-center justify-between">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
    
    <button 
      type="button"
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      on:click={toggleTheme}
      title="Toggle theme (current: {theme})"
    >
      {#if theme === 'light'}
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      {:else if theme === 'dark'}
        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      {:else}
        <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      {/if}
    </button>
  </div>
</header>