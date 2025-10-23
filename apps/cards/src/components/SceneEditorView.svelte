<script lang="ts">
  import { onMount } from 'svelte';
  import { SceneIdInput } from '../index';
  import { ChapterSelect } from '../index';
  import { SceneTextEditor } from '../index';
  import { ChoicesList } from '../index';
  import { StateChangesList } from '../index';
  import { db } from '@loke/shared/database';
  import type { Scene, Choice, StateChange } from '@schemas';

  export let sceneId: string | null = null;
  let chapterId = '';
  let title = '';
  let sceneText = '';
  let choices: { id: string; text: string; next?: string }[] = [];
  let stateChanges: { stateId: string; operation: string; value: string | number | boolean }[] = [];
  let status: string = '';

  onMount(async () => {
    if (!sceneId) return;
    const existing = await db.getScene(sceneId);
    if (existing) {
      chapterId = existing.chapterId || existing.chapter || '';
      title = existing.title || '';
      sceneText = existing.sceneText || '';

      // Load choices - map nextScene to next for UI
      if (existing.choices) {
        choices = existing.choices.map((c, index) => ({
          id: `choice-${index}`,
          text: c.text,
          next: c.nextScene
        }));
      }

      // Load state changes - map to new format
      if (existing.stateChanges) {
        stateChanges = existing.stateChanges.map(sc => ({
          stateId: sc.variable,
          operation: sc.operator === '=' ? 'set' :
                     sc.operator === '+=' ? 'add' :
                     sc.operator === '-=' ? 'subtract' : 'set',
          value: sc.value
        }));
      }
    }
  });

  async function save() {
    const now = Date.now();

    // Convert choices from UI format to Scene format
    const sceneChoices: Choice[] = choices
      .filter(c => c.text.trim() !== '')
      .map(c => ({
        text: c.text,
        nextScene: c.next || '',
        enabled: true
      }));

    // Convert state changes from UI format to Scene format
    const sceneStateChanges: StateChange[] = stateChanges
      .filter(sc => sc.stateId !== '')
      .map(sc => ({
        variable: sc.stateId,
        operator: sc.operation === 'set' ? '=' :
                  sc.operation === 'add' ? '+=' :
                  sc.operation === 'subtract' ? '-=' : '=',
        value: sc.value
      }));

    const s: Scene = {
      id: sceneId || title.toLowerCase().replace(/\s+/g, '-'),
      sceneId: sceneId || title.toLowerCase().replace(/\s+/g, '-'),
      chapterId,
      title,
      sceneText,
      choices: sceneChoices.length > 0 ? sceneChoices : undefined,
      stateChanges: sceneStateChanges.length > 0 ? sceneStateChanges : undefined,
      createdAt: String(now),
      updatedAt: String(now),
    };

    if (sceneId) {
      await db.updateScene(sceneId, s);
    } else {
      await db.createScene(s);
      sceneId = s.sceneId;
    }
    status = 'saved';
  }
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-900 dark:text-white" for="scene-title">Title</label>
    <input id="scene-title" class="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" bind:value={title} aria-label="Title" />
  </div>
  <SceneIdInput bind:value={sceneId} label="Scene ID" />
  <ChapterSelect bind:value={chapterId} />
  <SceneTextEditor bind:value={sceneText} maxLength={500} />

  <ChoicesList bind:items={choices} />
  <StateChangesList bind:items={stateChanges} />

  <button class="px-3 py-2 rounded bg-blue-600 text-white" on:click={save} data-testid="save-btn">Save</button>
  {#if status}
    <div data-testid="save-status">{status}</div>
  {/if}
</div>
