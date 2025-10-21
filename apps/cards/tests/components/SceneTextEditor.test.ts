import { render, fireEvent } from '@testing-library/svelte';
import SceneTextEditor from '../../src/components/SceneTextEditor.svelte';

test('shows character count and enforces maxlength', async () => {
  const { getByLabelText, getByText } = render(SceneTextEditor, { props: { label: 'Text', maxLength: 10, value: '' } });
  const ta = getByLabelText('Text') as HTMLTextAreaElement;
  const long = 'aaaaaaaaaaaa'; // 12 chars
  await fireEvent.input(ta, { target: { value: long } });
  // Browser enforces maxlength, so value length should be <= 10
  expect(ta.value.length).toBeLessThanOrEqual(10);
  const counter = getByText(/\/ 10$/);
  expect(counter).toBeInTheDocument();
});

