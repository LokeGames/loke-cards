<script lang="ts">
  import { onMount } from 'svelte';
  
  // UI Settings
  let uiSettings = {
    theme: 'system' as 'light' | 'dark' | 'system',
    autoSave: true,
    apiEndpoint: 'http://localhost:3000',
    dashboardLayout: 'grid' as 'grid' | 'list'
  };
  
  let saved = false;
  
  onMount(() => {
    // Load UI settings
    const stored = localStorage.getItem('loke-settings');
    if (stored) {
      uiSettings = { ...uiSettings, ...JSON.parse(stored) };
    }
  });
  
  function saveSettings() {
    localStorage.setItem('loke-settings', JSON.stringify(uiSettings));
    saved = true;
    setTimeout(() => saved = false, 2000);
  }
  
  function resetSettings() {
    uiSettings = {
      theme: 'system',
      autoSave: true,
      apiEndpoint: 'http://localhost:3000',
      dashboardLayout: 'grid'
    };
    saveSettings();
  }
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">Configure your Loke Cards experience</p>
  </div>
  
  <!-- Appearance -->
  <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎨 Appearance</h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <select 
          bind:value={uiSettings.theme}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="system">🖥️ System</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dashboard Layout
        </label>
        <select 
          bind:value={uiSettings.dashboardLayout}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>
    </div>
  </section>
  
  <!-- Behavior -->
  <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">⚙️ Behavior</h2>
    
    <div class="space-y-4">
      <div class="flex items-center">
        <input 
          type="checkbox" 
          bind:checked={uiSettings.autoSave}
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Auto-save changes
        </label>
      </div>
    </div>
  </section>
  
  <!-- API -->
  <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">🔗 API Configuration</h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          API Endpoint
        </label>
        <input 
          type="url" 
          bind:value={uiSettings.apiEndpoint}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  </section>
  
  <!-- Actions -->
  <section class="flex gap-4">
    <button 
      on:click={saveSettings}
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
    >
      💾 Save Settings
    </button>
    
    <button 
      on:click={resetSettings}
      class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
    >
      🔄 Reset to Defaults
    </button>
    
    {#if saved}
      <span class="text-green-600 font-medium self-center">✅ Saved!</span>
    {/if}
  </section>
</div>