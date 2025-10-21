<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import type { Scene } from '@schemas';

  type DataApi = { cards: { list(): Promise<Scene[]> } };
  let items: Scene[] = [];
  onMount(async () => {
    const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    worker.port.start();
    const api = Comlink.wrap<DataApi>(worker.port);
    items = await api.cards.list();
  });
</script>

<h2 class="text-xl font-semibold">Scenes</h2>
<ul>
  {#each items as s}
    <li data-testid="scene-row">{s.sceneId}: {s.title}</li>
  {/each}
</ul>

