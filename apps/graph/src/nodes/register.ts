import { LGraphNode, LiteGraph } from 'litegraph.js';
import { SceneNode } from '../lib/nodes/SceneNode';
import { ChapterNode } from '../lib/nodes/ChapterNode';

export const SCENE_NODE_TYPE = 'loke/scene';
export const CHAPTER_NODE_TYPE = 'loke/chapter';

export function registerNodes(LiteGraph: any) {
  if (!LiteGraph || !LiteGraph.LGraphNode || !LiteGraph.registerNodeType) return;

  // Register the imported SceneNode and ChapterNode classes
  LiteGraph.registerNodeType(SCENE_NODE_TYPE, SceneNode);
  LiteGraph.registerNodeType(CHAPTER_NODE_TYPE, ChapterNode);

  return { SceneNode, ChapterNode };
}