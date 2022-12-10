import { createMutableDocumentTree } from './tree';
import { walk, WalkController } from './walk';

const makeTree = () => {
    const tree = createMutableDocumentTree<string>('html');
    const html = tree.root;
    const head = tree.insertNewNode({ parent: html, data: 'head' }).newNode;
    const body = tree.insertNewNode({ parent: html, data: 'body' }).newNode;

    const meta1 = tree.insertNewNode({ parent: head, data: 'meta#1' }).newNode;
    const meta2 = tree.insertNewNode({ parent: head, data: 'meta#2' }).newNode;
    const style = tree.insertNewNode({ parent: head, data: 'style' }).newNode;
    tree.setTextContent({ node: style, content: '* { box-sizing: border-box; }' });

    const main = tree.insertNewNode({ parent: body, data: 'main' }).newNode;

    const section1 = tree.insertNewNode({ parent: main, data: 'section#1' }).newNode;
    const header1 = tree.insertNewNode({ parent: section1, data: 'h1' }).newNode;
    tree.setTextContent({ node: header1, content: 'Section 1' });
    const p1 = tree.insertNewNode({ parent: section1, data: 'p#1' }).newNode;
    tree.setTextContent({ node: p1, content: 'Lorem ipsum 1' });

    const section2 = tree.insertNewNode({ parent: main, data: 'section#2' }).newNode;
    const header2 = tree.insertNewNode({ parent: section2, data: 'h1' }).newNode;
    tree.setTextContent({ node: header2, content: 'Section 2' });
    const p2 = tree.insertNewNode({ parent: section2, data: 'p#2' }).newNode;
    tree.setTextContent({ node: p2, content: 'Lorem ipsum 2' });
    const p3 = tree.insertNewNode({ parent: section2, data: 'p#3' }).newNode;
    tree.setTextContent({ node: p3, content: 'Lorem ipsum 3' });

    const section3 = tree.insertNewNode({ parent: main, data: 'section#3' }).newNode;
    const header3 = tree.insertNewNode({ parent: section3, data: 'h1' }).newNode;
    tree.setTextContent({ node: header3, content: 'Section 3' });
    const p4 = tree.insertNewNode({ parent: section3, data: 'p#4' }).newNode;
    tree.setTextContent({ node: p4, content: 'Lorem ipsum 4' });

    return {
        tree,
        nodes: {
            html, head, body,
            meta1, meta2, style,
            main,
            section1, section2, section3,
            header1, header2, header3,
            p1, p2, p3, p4,
        },
        dfo: [
            html, head, meta1, meta2, style,
            body, main,
            section1, header1, p1,
            section2, header2, p2, p3,
            section3, header3, p4,
        ]
    };
};

describe('walk', () => {
    it('should walk in DFO', () => {
        const { tree, nodes, dfo } = makeTree();

        const visits: number[] = [];
        const cb = (node: number) => {
            visits.push(node);
        };

        walk({ tree, cb });
        expect(visits).toEqual(dfo);

        visits.length = 0;
        walk({ tree, startNode: nodes.body, cb });
        expect(visits).toEqual(dfo.slice(dfo.indexOf(nodes.body)).concat([nodes.html]));

        visits.length = 0;
        walk({ tree, startNode: nodes.p1, cb });
        expect(visits).toEqual([
            nodes.p1, nodes.section1, nodes.main,
            ...dfo.slice(dfo.indexOf(nodes.section2)),
            nodes.body, nodes.html,
        ]);
    });

    it('should visit every node no more than once', () => {
        const { tree, nodes } = makeTree();
        let visits: Record<number, number> = {};
        const cb = (node: number) => {
            if (!visits[node]) {
                visits[node] = 0;
            }
            ++visits[node];
        }

        walk({ tree, cb });
        expect(Object.values(visits).every((n) => n === 1)).toBe(true);

        visits = {};
        walk({ tree, startNode: nodes.header2, cb });
        expect(Object.values(visits).every((n) => n === 1)).toBe(true);
    });

    it('should not visit nodes to the left of startNode', () => {
        const { tree, nodes } = makeTree();

        const visits = new Set<number>();
        const cb = (node: number) => {
            visits.add(node);
        };

        walk({ tree, startNode: nodes.style, cb });
        expect(visits.has(nodes.meta1)).toBe(false);
        expect(visits.has(nodes.meta2)).toBe(false);
        expect(visits.has(nodes.style)).toBe(true);
    });

    it('should stop after .stop() has been called', () => {
        const { tree, nodes } = makeTree();

        const visits = new Set<number>();
        const cb = (node: number, ctx: WalkController<string>) => {
            visits.add(node);
            if (node === nodes.section3) {
                ctx.stop();
            }
        };

        walk({ tree, cb });
        expect(visits.has(nodes.section2)).toBe(true);
        expect(visits.has(nodes.section3)).toBe(true);
        expect(visits.has(nodes.header3)).toBe(false);
        expect(visits.has(nodes.p4)).toBe(false);
    });
});
