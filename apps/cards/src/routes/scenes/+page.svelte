<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@schemas';

  let items: Scene[] = [];
  onMount(async () => {
    items = await db.getAllScenes();
  });
</script>

<h2 class="text-xl font-semibold">Scenes</h2>
<ul>
  {#each items as s}
    <li data-testid="scene-row">{s.sceneId}: {s.title}</li>
  {/each}
</ul>

