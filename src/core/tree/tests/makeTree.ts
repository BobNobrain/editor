import { createMutableDocumentTree } from '../tree';

export const makeTree = () => {
    const t = createMutableDocumentTree<string>();

    const n0 = t.insertNewNode({ parent: t.root, data: '0' }).newNode; // 1
    const n1 = t.insertNewNode({ parent: t.root, data: '1' }).newNode; // 2

    const n00 = t.insertNewNode({ parent: n0, data: '00' }).newNode; // 3
    const n01 = t.insertNewNode({ parent: n0, data: '01' }).newNode; // 4
    const n02 = t.insertNewNode({ parent: n0, data: '02' }).newNode; // 5

    const n10 = t.insertNewNode({ parent: n1, data: '10' }).newNode; // 6
    const n11 = t.insertNewNode({ parent: n1, data: '11' }).newNode; // 7
    const n12 = t.insertNewNode({ parent: n1, data: '12' }).newNode; // 8

    const n000 = t.insertNewNode({ parent: n00, data: '000' }).newNode; // 9

    const n010 = t.insertNewNode({ parent: n01, data: '010' }).newNode; // 10

    const n100 = t.insertNewNode({ parent: n10, data: '100' }).newNode; // 11
    const n101 = t.insertNewNode({ parent: n10, data: '101' }).newNode; // 12

    const n1010 = t.insertNewNode({ parent: n101, data: '1010' }).newNode; // 13

    const n120 = t.insertNewNode({ parent: n12, data: '120' }).newNode; // 14
    const n121 = t.insertNewNode({ parent: n12, data: '121' }).newNode; // 15

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
