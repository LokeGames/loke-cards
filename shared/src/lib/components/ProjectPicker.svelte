<script>
  import { currentProject, projects, init, selectProject, createProject } from '../stores/project.store.js';
  import { onMount } from 'svelte';
  onMount(() => { if (!$currentProject) init(); });
  let currentId = '';
  $: currentId = $currentProject?.id || 'default';
  const onChange = (e) => selectProject(e.target.value);
  const onCreate = async () => {
    const name = window.prompt('New project name:');
    if (!name || !name.trim()) return;
    const p = await createProject(name.trim());
    await selectProject(p.id);
  };
</script>

<div class="flex items-center gap-2">
  <label class="text-xs text-gray-500 dark:text-gray-400">Project</label>
  <select bind:value={currentId} on:change={onChange} class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    {#each $projects as p}
      <option value={p.id}>{p.name || p.id}</option>
    {/each}
  </select>
  <button class="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" title="New project" aria-label="New project" on:click={onCreate}>+</button>
</div>

