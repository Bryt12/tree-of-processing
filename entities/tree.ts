import { drawP5, generateP5 } from '../scripts/processing';
import { eveluateImage, initializeModel } from '../scripts/llm_helpers';

import { Leaf } from './leaf';

export class Tree {
  root: Leaf;

  unexplored: Leaf[];

  constructor() {
    this.root = new Leaf('', '', -1);

    this.unexplored = [];
  }

  async generateLeaf(prompt: string): Promise<Leaf> {
    const leaf = await generateP5(prompt);
    await drawP5(leaf);

    const model = initializeModel('gpt-3.5-turbo');
    const score = await eveluateImage(model, leaf);

    if (!score) {
      console.log('Failed to evaluate image');
      return new Leaf('', '', -1);
    }

    console.log(`Score: ${score}`);
    leaf.setScore(parseInt(score, 10));

    return leaf;
  }

  async generateAndAddLeafToRoot(prompt: string) {
    const leaf = await this.generateLeaf(prompt);
    this.root = leaf;
    this.unexplored.push(leaf);
  }

  async growTree() {
    console.log("Growing tree")
    const leaf = this.unexplored.shift();

    if (!leaf) {
      console.log('No leaves to explore');
      return;
    }

    await leaf.createChildren();
    console.log('Created children')
    console.log(leaf.children.length)

    // Only add children to explore list if the depth is less than 4
    if (leaf.depth < 4) {
      this.unexplored.push(...leaf.children);
    }

    this.printTree();
  }

  printTree() {
    console.log('---------------Tree---------------');
    this.printNode(this.root, '');
  }

  printNode(node: Leaf, prefix: string) {
    console.log(prefix + 'hash: ' + node.hash);
    for (let i = 0; i < node.children.length; i++) {
      // Add a "-" for each level of depth
      this.printNode(node.children[i], prefix + '-');
    }
  }
}
