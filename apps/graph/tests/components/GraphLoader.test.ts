import { render, waitFor } from '@testing-library/svelte';
import GraphLoader from '../../src/components/GraphLoader.svelte';

vi.mock('comlink', async () => {
  return {
    wrap: () => ({ graph: { getProjectGraph: async () => ({ projectId: 'p1', nodes: [{ id: 'n1', type: 'scene', label: 'S1' }], edges: [] }) } }),
  } as any;
});

// Mock SharedWorker for JSDOM
// @ts-ignore
global.SharedWorker = class { port = { start() {} } } as any;

test('loads graph and shows counts', async () => {
  const { getByTestId } = render(GraphLoader, { props: { projectId: 'p1' } });
  await waitFor(() => expect(getByTestId('graph-nodes')).toHaveTextContent('1'));
  expect(getByTestId('graph-edges')).toHaveTextContent('0');
});

