import { render } from '@testing-library/svelte';
import AppHeader from '@shared/lib/components/AppHeader.svelte';

test('renders title and controls', () => {
  const { getByText, getByRole } = render(AppHeader, { props: { title: 'Loke Shell' } });
  expect(getByText('Loke Shell')).toBeInTheDocument();
  expect(getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
});

