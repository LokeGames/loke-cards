import { describe, test, expect } from 'vitest';
import { generateC } from '../../src/lib/codegen';

describe('codegen (C)', () => {
  test('emits function signature with scene id', () => {
    const code = generateC({
      sceneId: 'intro',
      chapterId: 'ch-1',
      title: 'Introduction',
      createdAt: 1,
      updatedAt: 1,
    }, [], []);
    expect(code).toContain('void scene_intro(void)');
    expect(code).toContain('/* Introduction */');
  });
});

