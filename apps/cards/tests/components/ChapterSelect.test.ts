import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChapterSelect from '../../src/components/ChapterSelect.svelte';

vi.mock('../../src/lib/dataClient', async () => {
  return {
    getChapters: vi.fn().mockResolvedValue([
      { chapterId: 'ch-1', title: 'Intro', createdAt: 1, updatedAt: 1 },
      { chapterId: 'ch-2', title: 'Middle', createdAt: 1, updatedAt: 1 },
    ]),
  };
});

test('lists chapters and emits change', async () => {
  const { getByLabelText, findByText, component } = render(ChapterSelect, { props: { label: 'Chapter', value: '' } });
  // Wait for options to populate
  await findByText('Intro');
  await findByText('Middle');

  const onChange = vi.fn();
  component.$on('change', (e) => onChange(e.detail));

  const select = getByLabelText('Chapter') as HTMLSelectElement;
  await fireEvent.change(select, { target: { value: 'ch-2' } });

  await waitFor(() => {
    expect(onChange).toHaveBeenCalledWith({ chapterId: 'ch-2' });
  });
});

