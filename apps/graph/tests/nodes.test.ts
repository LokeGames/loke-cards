import { describe, test, expect, beforeAll } from 'vitest';
import { registerNodes, SCENE_NODE_TYPE, CHAPTER_NODE_TYPE } from '../src/nodes/register';

let LiteGraph: any;

beforeAll(async () => {
  await import('litegraph.js');
  // @ts-ignore UMD exposes global
  LiteGraph = (globalThis as any).LiteGraph;
  expect(LiteGraph).toBeTruthy();
  registerNodes(LiteGraph);
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

