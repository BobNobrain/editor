import { selectSubtree } from '../../selection/create';
import { DocumentTreeRange } from '../../selection/types';
import { createMutableDocumentTree } from '../tree';
import { getSelectionText, joinSelectionFragments } from './getSelectionText';

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
    const header1 = tree.insertNewNode({ parent: section1, data: 'h1#1' }).newNode;
    tree.setTextContent({ node: header1, content: 'Section 1' });
    const p1 = tree.insertNewNode({ parent: section1, data: 'p#1' }).newNode;
    tree.setTextContent({ node: p1, content: 'Lorem ipsum 1' });

    const section2 = tree.insertNewNode({ parent: main, data: 'section#2' }).newNode;
    const header2 = tree.insertNewNode({ parent: section2, data: 'h1#2' }).newNode;
    tree.setTextContent({ node: header2, content: 'Section 2' });
    const p2 = tree.insertNewNode({ parent: section2, data: 'p#2' }).newNode;
    tree.setTextContent({ node: p2, content: 'Lorem ipsum 2' });
    const p3 = tree.insertNewNode({ parent: section2, data: 'p#3' }).newNode;
    tree.setTextContent({ node: p3, content: 'Lorem ipsum 3' });

    const section3 = tree.insertNewNode({ parent: main, data: 'section#3' }).newNode;
    const header3 = tree.insertNewNode({ parent: section3, data: 'h1#3' }).newNode;
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

describe('getSelectionText', () => {
    it('gets correct selection text with default offsets', () => {
        const { tree, nodes } = makeTree();
        const selection1 = selectSubtree({ tree, subtreeRoot: nodes.section2 });

        expect(joinSelectionFragments(getSelectionText({ tree, selection: selection1 }).fragments)).toBe(
            'Section 2Lorem ipsum 2Lorem ipsum 3'
        );

        const selection2 = selectSubtree({ tree, subtreeRoot: nodes.html });

        expect(joinSelectionFragments(getSelectionText({ tree, selection: selection2 }).fragments)).toBe(
            '* { box-sizing: border-box; }Section 1Lorem ipsum 1Section 2Lorem ipsum 2Lorem ipsum 3Section 3Lorem ipsum 4'
        );
    });

    it('gets correct selection text with custom offsets', () => {
        const { tree, nodes } = makeTree();
        const selection = selectSubtree({ tree, subtreeRoot: nodes.section2 });

        selection.start.textPosition = 2;
        selection.end.textPosition = 4;

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'ction 2Lorem ipsum 2Lore'
        );
    });

    it('gets correct selection text when selection is inside single node', () => {
        const { tree, nodes } = makeTree();
        const selection = selectSubtree({ tree, subtreeRoot: nodes.p2 });

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'Lorem ipsum 2'
        );

        selection.start.textPosition = 2;
        selection.end.textPosition = 10;

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'rem ipsu'
        );
    });

    it('gets correct selection text when selection is reversed', () => {
        const { tree, nodes } = makeTree();
        const selection = selectSubtree({ tree, subtreeRoot: nodes.section1 });
        [selection.start, selection.end] = [selection.end, selection.start];

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'Section 1Lorem ipsum 1'
        );

        selection.start.textPosition = 10;
        selection.end.textPosition = 2;

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'ction 1Lorem ipsu'
        );
    });

    it('gets correct selection text when selection is inside single node and reversed', () => {
        const { tree, nodes } = makeTree();
        const selection = selectSubtree({ tree, subtreeRoot: nodes.p2 });
        [selection.start, selection.end] = [selection.end, selection.start];

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'Lorem ipsum 2'
        );

        selection.start.textPosition = 10;
        selection.end.textPosition = 2;

        expect(joinSelectionFragments(getSelectionText({ tree, selection }).fragments)).toBe(
            'rem ipsu'
        );
    });
});
