<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@loke/shared';
  import { PageContainer, Button, LoadingState, EmptyState, Card } from '@ui';

  let scenes: Scene[] = [];
  let loading = true;

  onMount(async () => {
    try {
      scenes = await db.getAllScenes();
    } catch (error) {
      console.error('Failed to load scenes:', error);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  }
</script>

<PageContainer>
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="page-title">Scenes</h1>
    <Button variant="primary" href="/cards/scene/new">
      ➕ New Scene
    </Button>
  </div>

  <!-- Content -->
  {#if loading}
    <LoadingState message="Loading scenes..." />
  {:else if scenes.length === 0}
    <EmptyState
      icon="📄"
      title="No scenes yet"
      description="Get started by creating your first scene"
    >
      <Button variant="primary" href="/cards/scene/new">
        Create Scene
      </Button>
    </EmptyState>
  {:else}
    <div class="item-list">
      {#each scenes as scene}
        <Card variant="interactive">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="section-title">
                {scene.title || scene.sceneId}
              </h3>
              <p class="text-subtle mt-1">
                ID: <code class="code-inline">{scene.sceneId}</code>
              </p>
              {#if scene.chapterId}
                <p class="text-subtle mt-1">
                  Chapter: {scene.chapterId}
                </p>
              {/if}
              {#if scene.sceneText}
                <p class="text-muted mt-2 line-clamp-2">
                  {scene.sceneText.substring(0, 150)}{scene.sceneText.length > 150 ? '...' : ''}
                </p>
              {/if}
            </div>
            <div class="flex gap-2 ml-4">
              <Button variant="primary" size="sm" href={`/cards/editor?id=${scene.id}`}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                on:click={() => {
                  if (confirm(`Delete scene "${scene.title || scene.sceneId}"?`)) {
                    db.deleteScene(scene.id).then(() => {
                      scenes = scenes.filter(s => s.id !== scene.id);
                    });
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-subtle">
            <span>Created: {formatDate(scene.createdAt)}</span>
            <span>Updated: {formatDate(scene.updatedAt)}</span>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</PageContainer>
