import type { Scene } from '@schemas';

export type Choice = { id: string; text: string; next?: string };
export type StateChange = { key: string; value: string };

export function generateC(scene: Scene, choices: Choice[] = [], state: StateChange[] = []): string {
  const fn = `scene_${scene.sceneId}`.replace(/[^A-Za-z0-9_]/g, '_');
  const header = `/* ${scene.title} */\nvoid ${fn}(void) {`;
  const body: string[] = [];
  if (scene.sceneText) body.push(`  // ${scene.sceneText.replace(/\n/g, ' ')}`);
  if (choices.length) {
    body.push('  // Choices');
    for (const c of choices) {
      body.push(`  // - ${c.text}${c.next ? ` -> ${c.next}` : ''}`);
    }
  }
  if (state.length) {
    body.push('  // State Changes');
    for (const s of state) {
      body.push(`  // ${s.key} = ${s.value}`);
    }
  }
  const footer = '}\n';
  return [header, ...body, footer].join('\n');
}

