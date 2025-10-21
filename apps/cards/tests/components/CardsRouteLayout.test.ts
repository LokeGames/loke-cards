import { render } from '@testing-library/svelte';
import RouteLayout from '../../src/routes/+layout.svelte';

test('route layout renders slot content', () => {
  const { getByText } = render(RouteLayout as any, { slots: { default: '<div>SlotContent</div>' } });
  expect(getByText('SlotContent')).toBeInTheDocument();
});

