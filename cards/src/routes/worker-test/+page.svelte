<script lang="ts">
  import { onMount } from 'svelte';
  import { createDataWorkerClient } from '$lib/dataWorkerClient';

  let status: string = 'waiting';
  onMount(async () => {
    try {
      const client = createDataWorkerClient();
      const res = await client.ping();
      status = res;
    } catch (e) {
      status = 'error';
    }
  });
</script>

<h2 class="text-lg font-semibold">Worker Test</h2>
<p data-testid="worker-status">{status}</p>

