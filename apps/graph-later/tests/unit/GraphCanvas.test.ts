import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GraphCanvas from '../../src/lib/GraphCanvas.svelte';
import type { GraphJSON } from '@schemas';

// Mock litegraph.js
const mockLGraph = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  add: vi.fn(),
}));
const mockLGraphCanvas = vi.fn(() => ({
  set_canvas_background_color: vi.fn(),
  background_image: null,
}));
const mockCreateNode = vi.fn(() => ({ title: '', pos: [0, 0] }));

class MockLGraphNode {
  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.properties = {};
    this.title = '';
  }
  addInput(name: string, type: any) { this.inputs.push({ name, type }); }
  addOutput(name: string, type: any) { this.outputs.push({ name, type }); }
}

vi.mock('litegraph.js', () => ({
  LGraph: mockLGraph,
  LGraphCanvas: mockLGraphCanvas,
  createNode: mockCreateNode,
  LGraphNode: MockLGraphNode,
}));

describe('GraphCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockGraphData: GraphJSON = {
    nodes: [
      { id: 'node1', type: 'test_node', pos: { x: 10, y: 20 }, label: 'Test Node 1' },
      { id: 'node2', type: 'test_node', pos: { x: 30, y: 40 }, label: 'Test Node 2' },
    ],
    edges: [],
  };

  it('renders a canvas element', () => {
    render(GraphCanvas, { graphData: mockGraphData });
    const canvas = screen.getByTestId('graph-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('initializes LiteGraph components on mount and populates with nodes', async () => {
    render(GraphCanvas, { graphData: mockGraphData });

    await waitFor(() => {
      expect(mockLGraph).toHaveBeenCalled();
      expect(mockLGraphCanvas).toHaveBeenCalled();
    });

    const mockGraphInstance = mockLGraph.mock.results[0].value;
    const mockGraphCanvasInstance = mockLGraphCanvas.mock.results[0].value;

    expect(mockGraphInstance.start).toHaveBeenCalled();
    expect(mockGraphCanvasInstance.set_canvas_background_color).toHaveBeenCalledWith("#222");

    expect(mockCreateNode).toHaveBeenCalledTimes(mockGraphData.nodes.length);
    expect(mockGraphInstance.add).toHaveBeenCalledTimes(mockGraphData.nodes.length);

    // Check if nodes were added with correct properties
    expect(mockCreateNode).toHaveBeenCalledWith('test_node');
    expect(mockGraphInstance.add).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Node 1',
      pos: [10, 20],
    }));
    expect(mockGraphInstance.add).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Node 2',
      pos: [30, 40],
    }));
  });

  it('stops the graph on destroy', async () => {
    const { unmount } = render(GraphCanvas, { graphData: mockGraphData });

    await waitFor(() => {
      expect(mockLGraph).toHaveBeenCalled(); // Ensure graph is initialized before unmounting
    });

    const mockGraphInstance = mockLGraph.mock.results[0].value;
    expect(mockGraphInstance.stop).not.toHaveBeenCalled();

    unmount();

    // After unmount, the onDestroy hook should have been called
    expect(mockGraphInstance.stop).toHaveBeenCalled();
  });
});
