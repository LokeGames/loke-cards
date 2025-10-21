import { render, fireEvent } from '@testing-library/svelte';
import Breadcrumbs from '../../src/components/Breadcrumbs.svelte';

test('renders crumbs and emits navigate', async () => {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Scenes', href: '/cards/scenes' },
    { label: 'Editor' },
  ];
  const { getByText, component } = render(Breadcrumbs, { props: { items: crumbs } });
  expect(getByText('Home')).toBeInTheDocument();
  expect(getByText('Scenes')).toBeInTheDocument();
  expect(getByText('Editor')).toBeInTheDocument();

  const spy = vi.fn();
  component.$on('navigate', (e) => spy(e.detail));
  await fireEvent.click(getByText('Scenes'));
  expect(spy).toHaveBeenCalledWith({ href: '/cards/scenes' });
});

