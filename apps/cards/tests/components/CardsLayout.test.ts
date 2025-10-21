import { render } from '@testing-library/svelte';
import CardsLayout from '../../src/components/CardsLayout.svelte';

test('renders header, sidebar, and slot', () => {
  const { getByText, container } = render(CardsLayout, { props: { title: 'Cards App' }, slots: { default: '<div>Content</div>' } });
  expect(getByText('Cards App')).toBeInTheDocument();
  const aside = container.querySelector('aside');
  expect(aside).toBeInTheDocument();
  expect(getByText('Content')).toBeInTheDocument();
});

