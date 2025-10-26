import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GraphLoader from '../../src/lib/GraphLoader.svelte';
import type { GraphJSON } from '@schemas';

// Import the actual getWorkerApi from the mocked module
import { getWorkerApi } from '@loke/worker-client';

// Mock the @loke/worker-client module to return a simple vi.fn() for getWorkerApi
vi.mock('@loke/worker-client', () => ({
  getWorkerApi: vi.fn(),
}));

// Define the spy for GraphCanvas at the top level
const mockGraphCanvasSpy = vi.fn();

// Mock GraphCanvas component directly in the test file
vi.mock('../../src/lib/GraphCanvas.svelte', () => ({
  default: vi.fn((props) => {
    // We still call the spy to record that the component was rendered
    // but we won't assert on the props directly due to Svelte mocking complexities.
    mockGraphCanvasSpy(props); 
    return {
      // Minimal Svelte component interface for testing-library/svelte
      $$render: () => '<div data-testid="mock-graph-canvas"></div>',
    };
  }),
}));

// Mock SharedWorker
class MockMessagePort {
  onmessage: ((event: MessageEvent) => void) | null = null;
  start = vi.fn();
  postMessage = vi.fn();
}

class MockSharedWorker {
  port: MockMessagePort;
  constructor() {
    this.port = new MockMessagePort();
  }
}

// @ts-ignore
global.SharedWorker = MockSharedWorker;

describe('GraphLoader', () => {
  let getProjectGraphSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on the getWorkerApi function that is actually imported
    const mockApi = {
      graph: {
        getProjectGraph: vi.fn(),
      },
    };
    (getWorkerApi as ReturnType<typeof vi.fn>).mockResolvedValue(mockApi);
    getProjectGraphSpy = mockApi.graph.getProjectGraph;

    // Clear the spy for GraphCanvas before each test
    mockGraphCanvasSpy.mockClear();
  });

  const mockGraphData: GraphJSON = {
    nodes: [
      { id: 'node1', type: 'test_node', pos: { x: 10, y: 20 }, label: 'Test Node 1' },
    ],
    edges: [],
  };

  it('displays a loading message initially', () => {
    getProjectGraphSpy.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it in loading state
    render(GraphLoader);
    expect(screen.getByText('Loading graph...')).toBeInTheDocument();
  });

  it('fetches and displays graph data', async () => {
    getProjectGraphSpy.mockResolvedValueOnce(mockGraphData);
    render(GraphLoader);

    expect(screen.getByText('Loading graph...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getWorkerApi).toHaveBeenCalled();
      expect(getProjectGraphSpy).toHaveBeenCalled();
    });

    expect(screen.queryByText('Loading graph...')).not.toBeInTheDocument();
  });

  it('displays an error message if fetching fails', async () => {
    const errorMessage = 'Failed to fetch graph data';
    getProjectGraphSpy.mockRejectedValueOnce(new Error(errorMessage));
    render(GraphLoader);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading graph...')).not.toBeInTheDocument();
  });
});
