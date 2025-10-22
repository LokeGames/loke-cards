import { LGraphNode } from 'litegraph.js';

export class ChapterNode extends LGraphNode {
  static title = 'Chapter';
  static desc = 'A chapter in the interactive fiction';

  constructor() {
    super();
    this.addInput('in', 'chapter');
    this.addOutput('out', 'chapter');
    this.properties = { chapterId: '' };
    this.title = ChapterNode.title;
  }

  onExecute() {
    // Logic for when the node executes
  }
}
