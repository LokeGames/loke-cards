import { render, fireEvent } from '@testing-library/svelte';
import StateChangesList from '../../src/components/StateChangesList.svelte';

test('adds and removes state changes', async () => {
  const { getAllByTestId, getByRole } = render(StateChangesList, { props: { items: [] } });
  const addBtn = getByRole('button', { name: /add state change/i });
  await fireEvent.click(addBtn);
  await fireEvent.click(addBtn);
  expect(getAllByTestId('state-row').length).toBe(2);

  const removeBtns = document.querySelectorAll('button[aria-label="Remove state change"]');
  await fireEvent.click(removeBtns[0] as HTMLButtonElement);
  expect(getAllByTestId('state-row').length).toBe(1);
});

