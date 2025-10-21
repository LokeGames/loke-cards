import { render, screen, fireEvent } from '@testing-library/svelte';
import AppHeader from '@shared/lib/components/AppHeader.svelte';
import { isSidebarOpen, closeSidebar } from '@shared/lib/stores/ui.store';

describe('AppHeader', () => {
  test('renders provided title', () => {
    render(AppHeader, { props: { title: 'My Title' } });
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  test('burger toggles sidebar store', async () => {
    closeSidebar();
    let value;
    const unsub = isSidebarOpen.subscribe((v) => (value = v));

    render(AppHeader, { props: { title: 'Toggle Test' } });
    const button = screen.getByRole('button', { name: /toggle menu/i });
    expect(value).toBe(false);
    await fireEvent.click(button);
    expect(value).toBe(true);

    unsub();
  });
});
