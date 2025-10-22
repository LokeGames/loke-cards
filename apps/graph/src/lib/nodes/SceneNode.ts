import { LGraphNode } from 'litegraph.js';

export class SceneNode extends LGraphNode {
  static title = 'Scene';
  static desc = 'A scene in the interactive fiction';

  constructor() {
    super();
    this.addInput('in', 'scene');
    this.addOutput('out', 'scene');
    this.properties = { sceneId: '' };
    this.title = SceneNode.title;
  }

  onExecute() {
    // Logic for when the node executes
  }
}
