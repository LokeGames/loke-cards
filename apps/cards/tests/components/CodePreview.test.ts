import { render } from '@testing-library/svelte';
import CodePreview from '../../src/components/CodePreview.svelte';

test('renders generated C code', () => {
  const scene = { sceneId: 'intro', chapterId: 'ch-1', title: 'Introduction', createdAt: 1, updatedAt: 1 };
  const { getByTestId } = render(CodePreview, { props: { scene } });
  const pre = getByTestId('code-preview');
  expect(pre.textContent).toContain('void scene_intro(void)');
});

