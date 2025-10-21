import { render, fireEvent } from '@testing-library/svelte';
import ThemeToggle from '@shared/lib/components/ThemeToggle.svelte';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    // @ts-expect-error allow cleaning test state
    delete window.localStorage.theme;
  });

  it('applies dark class and persists preference', async () => {
    const { getByRole } = render(ThemeToggle);
    const btn = getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await fireEvent.click(btn);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.theme).toBe('dark');

    await fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.theme).toBe('light');
  });
});

