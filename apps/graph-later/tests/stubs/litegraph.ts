type NodeType = new () => FakeNode;

class FakeNode {
  title = '';
  inputs: Array<{ name: string; type: number }> = [];
  outputs: Array<{ name: string; type: number }> = [];
  pos: [number, number] = [0, 0];

  addInput(name: string, type: number) {
    this.inputs.push({ name, type });
  }

  addOutput(name: string, type: number) {
    this.outputs.push({ name, type });
  }

  connect(): void {
    // no-op; tests replace to track connections
  }
}

class FakeGraph {
  nodes: FakeNode[] = [];

  add(node: FakeNode): void {
    this.nodes.push(node);
  }
}

class FakeCanvas {
  ds = { offset: [0, 0], scale: 1 };
  constructor(_element: HTMLCanvasElement, _graph: FakeGraph) {}
  setCanvas() {}
}

const registry = new Map<string, NodeType>();

function registerNodeType(type: string, ctor: NodeType): void {
  registry.set(type, ctor);
}

function createNode(type: string): FakeNode {
  const Ctor = registry.get(type) ?? FakeNode;
  return new Ctor();
}

export const LiteGraph = {
  LGraph: FakeGraph,
  LGraphNode: FakeNode,
  LGraphCanvas: FakeCanvas,
  ACTION: 0,
  EVENT: 0,
  createNode,
  registerNodeType,
};

export const LGraph = FakeGraph;
export const LGraphNode = FakeNode;
export const LGraphCanvas = FakeCanvas;
export const ACTION = 0;
export const EVENT = 0;
export { registerNodeType, createNode };
export default LiteGraph;
