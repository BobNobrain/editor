import { createMutableDocumentTree } from '../tree';
import type { DocumentTree } from '../types';
import { getCommonParent } from './getCommonParent';

const makeTree = () => {
    const t = createMutableDocumentTree<null>();

    const n0 = t.insertNewNode({ parent: t.root, data: null }).newNode; // 1
    const n1 = t.insertNewNode({ parent: t.root, data: null }).newNode; // 2

    const n00 = t.insertNewNode({ parent: n0, data: null }).newNode; // 3
    const n01 = t.insertNewNode({ parent: n0, data: null }).newNode; // 4
    const n02 = t.insertNewNode({ parent: n0, data: null }).newNode; // 5

    const n10 = t.insertNewNode({ parent: n1, data: null }).newNode; // 6
    const n11 = t.insertNewNode({ parent: n1, data: null }).newNode; // 7
    const n12 = t.insertNewNode({ parent: n1, data: null }).newNode; // 8

    const n000 = t.insertNewNode({ parent: n00, data: null }).newNode; // 9

    const n010 = t.insertNewNode({ parent: n01, data: null }).newNode; // 10

    const n100 = t.insertNewNode({ parent: n10, data: null }).newNode; // 11
    const n101 = t.insertNewNode({ parent: n10, data: null }).newNode; // 12

    const n1010 = t.insertNewNode({ parent: n101, data: null }).newNode; // 13

    const n120 = t.insertNewNode({ parent: n12, data: null }).newNode; // 14
    const n121 = t.insertNewNode({ parent: n12, data: null }).newNode; // 15

    /**                  __________root___________
     *                  /                         \
     *         ________n0_____                  ___n1______
     *        /        |      \                /     |     \
     *      n00       n01     n02            n10    n11    n12
     *        |        |                    /   \         /   \
     *      n000      n010                n100  n101    n120  n121
     *                                            |
     *                                          n1010
     */

    return {
        tree: t,
        n0, n1,
        n00, n01, n02,
        n10, n11, n12,
        n000, n010, n100, n101, n120, n121,
        n1010,
    };
};

describe('getCommonParent', () => {
    it('finds least common parent for 2 nodes in a tree', () => {
        const { tree, n010, n02, n0, n1010, n120, n11, n1 } = makeTree();

        expect(getCommonParent({ tree, child1: n010, child2: n02 }).commonParent).toBe(n0);
        expect(getCommonParent({ tree, child1: n1010, child2: n120 }).commonParent).toBe(n1);
        expect(getCommonParent({ tree, child1: n11, child2: n120 }).commonParent).toBe(n1);
        expect(getCommonParent({ tree, child1: n010, child2: n1010 }).commonParent).toBe(tree.root);
    });

    it('returns correct parent if nodes are the same', () => {
        const { tree, n01 } = makeTree();

        expect(getCommonParent({ tree, child1: n01, child2: n01 }).commonParent).toBe(n01);
        expect(getCommonParent({ tree, child1: tree.root, child2: tree.root }).commonParent).toBe(tree.root);
    });

    it('returns correct parent if one of the nodes is a direct ancestor of the other', () => {
        const { tree, n10, n1010 } = makeTree();

        expect(getCommonParent({ tree, child1: n10, child2: n1010 }).commonParent).toBe(n10);
        expect(getCommonParent({ tree, child1: n1010, child2: n10 }).commonParent).toBe(n10);
        expect(getCommonParent({ tree, child1: n1010, child2: tree.root }).commonParent).toBe(tree.root);
        expect(getCommonParent({ tree, child1: tree.root, child2: n10 }).commonParent).toBe(tree.root);
    });

    it('returns parent chains that start with source node and end with the found parent', () => {
        const {
            tree,
            n000, n00, n02, n0,
            n10, n1010, n101, n1,
        } = makeTree();

        const test1 = getCommonParent({ tree, child1: n000, child2: n02 });
        expect(test1.chain1).toEqual([ n000, n00, n0 ]);
        expect(test1.chain2).toEqual([ n02, n0 ]);

        const test2 = getCommonParent({ tree, child1: n10, child2: n1010 });
        expect(test2.chain1).toEqual([ n10 ]);
        expect(test2.chain2).toEqual([ n1010, n101, n10 ]);

        const test3 = getCommonParent({ tree, child1: n10, child2: n02 });
        expect(test3.chain1).toEqual([ n10, n1, tree.root ]);
        expect(test3.chain2).toEqual([ n02, n0, tree.root ]);
    });

    it('does not hang when there is no common parent', () => {
        const {
            tree,
            n1010, n101, n10, n1,
        } = makeTree();

        const result = getCommonParent({ tree, child1: n1010, child2: NaN });
        expect(result.commonParent).toBe(undefined);
        expect(result.chain1).toEqual([n1010, n101, n10, n1, tree.root]);
        expect(result.chain2).toEqual([NaN]);
    });
});
