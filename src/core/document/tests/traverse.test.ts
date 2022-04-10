import { Maybe } from '../../../util/Maybe';
import { traverse } from '../traverse';
import type { DocumentNode } from '../types';

let id = 0;
let testTree: Record<number, DocumentNode> = {};
const node = (parent?: number): number => {
    const node: DocumentNode = {
        id: id++,
        type: 'node',
        content: [],
    };
    testTree[node.id] = node;
    if (parent !== undefined) {
        (testTree[parent].content as unknown as number[]).push(node.id);
    }
    return node.id;
};

describe('traverse', () => {
    beforeAll(() => {
        id = 0;
        testTree = {};
        node(); // 0
        node(0); node(0); // 1, 2
        node(1); node(1); node(2); node(2); node(2); // 3-7
        node(3); node(4); node(4); node(7); // 8-11
        node(9); // 12
    });

    it('visits all nodes by default', () => {
        const visits: Record<number, boolean> = {};
        for (let i = 0; i < id; i++) {
            visits[i] = false;
        }

        traverse(testTree[0], testTree, (node) => {
            visits[node.id] = true;
        });

        expect(Object.values(visits).every(Boolean)).toBe(true);
    });

    it('visits nodes in depth-first order', () => {
        const visits: number[] = [];
        traverse(testTree[0], testTree, (node) => {
            visits.push(node.id);
        });

        expect(visits).toEqual(
            [0, 1, 3, 8, 4, 9, 12, 10, 2, 5, 6, 7, 11],
        );
    });

    it('skips children if asked to', () => {
        const visits: Record<number, boolean> = {};
        for (let i = 0; i < id; i++) {
            visits[i] = false;
        }

        traverse(testTree[0], testTree, (node, ctx) => {
            visits[node.id] = true;
            if (node.id === 4) {
                ctx.doNotVisitChildren();
            }
        });

        expect([visits[9], visits[10], visits[12]].some(Boolean)).toBe(false);

        delete visits[9];
        delete visits[10];
        delete visits[12];
        expect(Object.values(visits).every(Boolean)).toBe(true);
    });

    it('bails out when resolved', () => {
        const visits: Record<number, boolean> = {};
        for (let i = 0; i < id; i++) {
            visits[i] = false;
        }

        const result = traverse<number>(testTree[0], testTree, (node, ctx) => {
            visits[node.id] = true;
            if (node.id === 5) {
                ctx.resolve(42);
            }
        });

        expect(result).toEqual(Maybe.just(42));

        expect([visits[6], visits[7], visits[11]].some(Boolean)).toBe(false);

        delete visits[6];
        delete visits[7];
        delete visits[11];
        expect(Object.values(visits).every(Boolean)).toBe(true);
    });
});
