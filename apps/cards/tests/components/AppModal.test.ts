import { render, fireEvent } from '@testing-library/svelte';
import { AppModal } from '@ui';

test('modal dispatches confirm and cancel', async () => {
  const { component, getByText } = render(AppModal as any, { open: true, title: 'Confirm' });
  const confirmSpy = vi.fn();
  const cancelSpy = vi.fn();
  component.$on('confirm', confirmSpy);
  component.$on('cancel', cancelSpy);

  await fireEvent.click(getByText('Confirm'));
  await fireEvent.click(getByText('Cancel'));

  expect(confirmSpy).toHaveBeenCalled();
  expect(cancelSpy).toHaveBeenCalled();
});

