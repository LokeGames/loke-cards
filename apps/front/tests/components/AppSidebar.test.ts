import { render } from '@testing-library/svelte';
import AppSidebar from '@shared/lib/components/AppSidebar.svelte';

test('renders sidebar container', () => {
  const { container } = render(AppSidebar);
  // Verify the desktop aside exists in DOM
  const aside = container.querySelector('aside');
  expect(aside).toBeInTheDocument();
});

