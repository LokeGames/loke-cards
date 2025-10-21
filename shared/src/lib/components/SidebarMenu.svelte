<script>
  import NavLink from './NavLink.svelte';
  import { currentProject } from '../stores/project.store.js';
  import { onMount } from 'svelte';
  import { getStorageStats } from '../storage.js';
  let stats = { scenes: 0, chapters: 0 };
  onMount(async () => {
    try { stats = await getStorageStats(); } catch {}
  });
</script>

<div>
  <ul class="space-y-1 text-sm">
    <li><NavLink to="/">Dashboard</NavLink></li>
    <li><NavLink to="/scenes">Scenes</NavLink></li>
    <li><NavLink to="/chapters">Chapters</NavLink></li>
    <li><NavLink to="/toc">Story Map</NavLink></li>
    <li><NavLink to="/code">C code</NavLink></li>
    <li><NavLink to="/settings">Settings</NavLink></li>
  </ul>

  <div class="mt-6 px-3">
    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Project Info</h3>
    <div class="text-sm text-gray-700 dark:text-gray-300">
      <p class="font-semibold">{$currentProject?.name || 'No Project'}</p>
      <p>Scenes: {stats.scenes}</p>
      <p>Chapters: {stats.chapters}</p>
    </div>
  </div>

  <div class="mt-6 px-3">
    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h3>
    <ul class="space-y-1 text-sm">
      <li>
        <NavLink to="/scene/new" class="group flex items-center gap-2">New Scene</NavLink>
      </li>
      <li>
        <NavLink to="/chapter/new" class="group flex items-center gap-2">New Chapter</NavLink>
      </li>
    </ul>
  </div>
</div>

<style>
.nav-item.router-link-active { /* for parity; handled by activeClass */ }
</style>

