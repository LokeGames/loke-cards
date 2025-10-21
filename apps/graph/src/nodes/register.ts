export const SCENE_NODE_TYPE = 'loke/scene';
export const CHAPTER_NODE_TYPE = 'loke/chapter';

export function registerNodes(LiteGraph: any) {
  if (!LiteGraph || !LiteGraph.LGraphNode || !LiteGraph.registerNodeType) return;

  class SceneNode extends LiteGraph.LGraphNode {
    sceneId: string | undefined;
    constructor() {
      super();
      this.title = 'Scene';
      this.addInput('in', LiteGraph.ACTION || 0);
      this.addOutput('out', LiteGraph.EVENT || 0);
      this.size = this.computeSize();
    }
  }
  (SceneNode as any).title = 'Scene';
  (SceneNode as any).desc = 'Scene node';
  LiteGraph.registerNodeType(SCENE_NODE_TYPE, SceneNode);

  class ChapterNode extends LiteGraph.LGraphNode {
    chapterId: string | undefined;
    constructor() {
      super();
      this.title = 'Chapter';
      this.addInput('in', LiteGraph.ACTION || 0);
      this.addOutput('out', LiteGraph.EVENT || 0);
      this.size = [200, 120];
    }
  }
  (ChapterNode as any).title = 'Chapter';
  (ChapterNode as any).desc = 'Chapter node';
  LiteGraph.registerNodeType(CHAPTER_NODE_TYPE, ChapterNode);

  return { SceneNode, ChapterNode };
}

