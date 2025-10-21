import { render, fireEvent } from '@testing-library/svelte';
import SceneIdInput from '../../src/components/SceneIdInput.svelte';

test('validates C identifier rules', async () => {
  const { getByLabelText, getByText } = render(SceneIdInput, { props: { value: '', label: 'Scene ID' } });
  const input = getByLabelText('Scene ID') as HTMLInputElement;

  await fireEvent.input(input, { target: { value: '1abc' } });
  expect(getByText(/Invalid ID/)).toBeInTheDocument();

  await fireEvent.input(input, { target: { value: 'abc_1' } });
  expect(getByText(/Must be a valid C identifier/)).toBeInTheDocument();
});

