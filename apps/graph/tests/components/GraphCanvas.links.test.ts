import { render } from '@testing-library/svelte';
import GraphCanvas from '../../src/components/GraphCanvas.svelte';

vi.mock('litegraph.js', () => {
  class LGraphNode { addInput(){} addOutput(){} constructor(){ this.title=''; this.inputs=[]; this.outputs=[]; } }
  class LGraph { add(){} }
  class LGraphCanvas { constructor(_el:any,_g:any){ this.ds={offset:[0,0],scale:1}; } }
  const created: any[] = [];
  function createNode(_type: string){ const n:any = new LGraphNode(); n.connect = vi.fn(); created.push(n); return n; }
  return { default: {}, LGraph, LGraphCanvas, LGraphNode, createNode, LiteGraph: { LGraph, LGraphCanvas, LGraphNode, createNode, ACTION: 0, EVENT: 0 } };
});

test('builds nodes and connects edges', async () => {
  const graph = {
    projectId: 'p1',
    nodes: [
      { id: 'scene:a', type: 'scene', label: 'A' },
      { id: 'scene:b', type: 'scene', label: 'B' },
    ],
    edges: [
      { id: 'edge:1', source: 'scene:a', target: 'scene:b' },
    ],
  };
  const { getByTestId } = render(GraphCanvas, { props: { autoInit: true, graph } });
  const canvas = getByTestId('graph-canvas');
  expect(canvas.getAttribute('data-nodes')).toBe('2');
  expect(canvas.getAttribute('data-edges')).toBe('1');
});

