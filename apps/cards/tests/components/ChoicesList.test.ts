import { render, fireEvent } from '@testing-library/svelte';
import ChoicesList from '../../src/components/ChoicesList.svelte';

test('adds and removes choices', async () => {
  const { getAllByTestId, getByRole } = render(ChoicesList, { props: { items: [] } });
  const addBtn = getByRole('button', { name: /add choice/i });
  await fireEvent.click(addBtn);
  await fireEvent.click(addBtn);
  expect(getAllByTestId('choice-row').length).toBe(2);

  const removeBtns = document.querySelectorAll('button[aria-label="Remove choice"]');
  await fireEvent.click(removeBtns[0] as HTMLButtonElement);
  expect(getAllByTestId('choice-row').length).toBe(1);
});

