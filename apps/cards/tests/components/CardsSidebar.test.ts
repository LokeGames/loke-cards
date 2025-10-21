import { render } from '@testing-library/svelte';
import { isSidebarOpen } from '@shared/lib/stores/ui.store';
import CardsSidebar from '../../src/components/CardsSidebar.svelte';

test('renders sidebar', () => {
  const { container } = render(CardsSidebar);
  const aside = container.querySelector('aside');
  expect(aside).toBeInTheDocument();
});

test('shows mobile drawer overlay when sidebar is open', async () => {
  const { container } = render(CardsSidebar);
  isSidebarOpen.set(true);
  // Allow Svelte tick to flush (Testing Library macro-task suffices)
  await new Promise((r) => setTimeout(r, 0));
  const overlay = container.querySelector('div[role="button"][aria-label="Close menu overlay"]');
  expect(overlay).toBeInTheDocument();
  isSidebarOpen.set(false);
});
