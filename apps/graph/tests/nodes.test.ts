import { describe, test, expect, beforeAll, vi } from 'vitest';
import { registerNodes, SCENE_NODE_TYPE, CHAPTER_NODE_TYPE } from '../src/nodes/register';

let LiteGraph: any;

beforeAll(() => {
  class TestNode {
    title = '';
    inputs: Array<{ name: string; type: number }> = [];
    outputs: Array<{ name: string; type: number }> = [];
    size = [180, 80];
    addInput(name: string, type: number) {
      this.inputs.push({ name, type });
    }
    addOutput(name: string, type: number) {
      this.outputs.push({ name, type });
    }
    computeSize() {
      return this.size;
    }
  }

  const registry = new Map<string, any>();
  LiteGraph = {
    LGraphNode: TestNode,
    ACTION: 1,
    EVENT: 2,
    registerNodeType: vi.fn((type: string, ctor: any) => {
      registry.set(type, ctor);
    }),
    createNode: (type: string) => {
      const Ctor = registry.get(type);
      return Ctor ? new Ctor() : null;
    },
  };

  registerNodes(LiteGraph);
  LiteGraph.__registry = registry;
});

describe('Core Node Types', () => {
  test('registers SceneNode and ChapterNode', () => {
    const scene = LiteGraph.createNode(SCENE_NODE_TYPE);
    const chap = LiteGraph.createNode(CHAPTER_NODE_TYPE);
    expect(scene).toBeTruthy();
    expect(chap).toBeTruthy();
    expect(scene.title).toBe('Scene');
    expect(chap.title).toBe('Chapter');
    expect(scene.outputs?.length).greaterThanOrEqual(1);
    expect(chap.inputs?.length).greaterThanOrEqual(1);
  });
});
