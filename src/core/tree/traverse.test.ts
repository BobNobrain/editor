import { Maybe } from '../../util/Maybe';
import { traverse } from './traverse';
import { createMutableDocumentTree } from './tree';

const makeTree = () => {
    const t = createMutableDocumentTree<null>(null);

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
        nodes: [
            t.root,
            n0, n1,
            n00, n01, n02,
            n10, n11, n12,
            n000, n010, n100, n101, n120, n121,
            n1010,
        ],
    };
};

describe('traverse', () => {
    it('visits all nodes by default', () => {
        const { tree, nodes } = makeTree();

        const visits: Record<number, boolean> = {};
        for (const node of nodes) {
            visits[node] = false;
        }

        traverse(tree, (visits, node) => {
            visits[node] = true;
            return visits;
        }, visits);

        expect(Object.values(visits).every(Boolean)).toBe(true);
    });

    it('visits nodes in depth-first order', () => {
        const {
            tree,
            n0, n1,
            n00, n01, n02,
            n10, n11, n12,
            n000, n010, n100, n101, n120, n121,
            n1010,
        } = makeTree();

        const visits: number[] = [];
        traverse(tree, (visits, node) => {
            visits.push(node);
            return visits;
        }, visits);

        expect(visits).toEqual([
            tree.root,
            n0, n00, n000, n01, n010, n02,
            n1, n10, n100, n101, n1010, n11, n12, n120, n121,
        ]);
    });

    it('skips subtree if asked to', () => {
        const {
            tree, nodes,
            n10, n100, n101, n1010,
        } = makeTree();

        const visits: Record<number, boolean> = {};
        for (const node of nodes) {
            visits[node] = false;
        }

        traverse(tree, (visits, node, ctx) => {
            visits[node] = true;
            if (node === n10) {
                ctx.skipSubtree();
            }
            return visits;
        }, visits);

        expect([visits[n100], visits[n101], visits[n1010]].some(Boolean)).toBe(false);

        delete visits[n100];
        delete visits[n101];
        delete visits[n1010];
        expect(Object.values(visits).every(Boolean)).toBe(true);
    });

    it('stops when asked to', () => {
        const {
            tree, nodes,
            n10, n100,
            n1010, n101, n12,
            n120, n121, n11,
        } = makeTree();

        const visits: Record<number, boolean> = {};
        for (const node of nodes) {
            visits[node] = false;
        }

        const result = traverse<number>(tree, (result, node, ctx) => {
            visits[node] = true;
            if (node === n10) {
                ctx.stop();
            }
            return result + 1;
        }, 0);

        expect(result).toEqual(9);

        expect([
            visits[n100],
            visits[n101],
            visits[n1010],
            visits[n120],
            visits[n11],
            visits[n12],
            visits[n121],
        ].some(Boolean)).toBe(false);
    })
});
