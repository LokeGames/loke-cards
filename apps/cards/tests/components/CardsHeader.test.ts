import { render, fireEvent } from '@testing-library/svelte';
import CardsHeader from '../../src/components/CardsHeader.svelte';

test('renders provided title and theme toggle', () => {
  const { getByText, getByRole } = render(CardsHeader, { props: { title: 'Scenes' } });
  expect(getByText('Scenes')).toBeInTheDocument();
  expect(getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
});

test('shows breadcrumbs and dispatches back', async () => {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Scenes', href: '/cards/scenes' },
    { label: 'Editor' },
  ];
  const { getByText, getByRole, component } = render(CardsHeader, { props: { title: 'Scenes', breadcrumbs: crumbs } });
  expect(getByText('Home')).toBeInTheDocument();
  expect(getByText('Editor')).toBeInTheDocument();
  const backSpy = vi.fn();
  component.$on('back', backSpy);
  await fireEvent.click(getByRole('button', { name: 'Back' }));
  expect(backSpy).toHaveBeenCalled();
});
