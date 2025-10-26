<script lang="ts">
  import GraphView from '@apps-graph/components/GraphView.svelte';
  export let params: { id: string };
</script>

<h2 class="text-xl font-semibold">Chapter Graph: {params.id}</h2>
<GraphView projectId={undefined} chapterId={params.id} />
