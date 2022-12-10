import { makeTree } from './makeTree';

describe('MutableDocumentTree::createNode', () => {
    it('creates node with data provided', () => {
        const { tree, n1, n1010 } = makeTree();

        expect(tree.getNodeData(n1)).toBe('1');
        expect(tree.getNodeData(n1010)).toBe('1010');
    });

    it('creates nodes under proper parents', () => {
        const { tree, n0, n02, n101, n1010 } = makeTree();

        expect(tree.getParentOf(n0)).toBe(tree.root);
        expect(tree.getParentOf(n02)).toBe(n0);
        expect(tree.getParentOf(n1010)).toBe(n101);
    });
});
