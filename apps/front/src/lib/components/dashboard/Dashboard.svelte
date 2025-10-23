<script lang="ts">
  import ProjectStats from './ProjectStats.svelte';
  import RecentChapters from './RecentChapters.svelte';
  import RecentScenes from './RecentScenes.svelte';
</script>

<div class="p-6 space-y-6">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's an overview of your project.</p>
  </div>

  <div class="mb-6">
    <ProjectStats />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RecentChapters />
    <RecentScenes />
  </div>
</div>