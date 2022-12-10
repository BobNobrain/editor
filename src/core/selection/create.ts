import { DocumentTree } from '../tree/types';
import { DocumentTreeRange } from './types';

export interface SelectSubtreePayload {
    tree: DocumentTree<any>;
    subtreeRoot?: number;
}
export function selectSubtree({ tree, subtreeRoot = tree.root }: SelectSubtreePayload): DocumentTreeRange {
    let leftCursor = subtreeRoot;
    let rightCursor = subtreeRoot;

    while (!tree.isLeaf(leftCursor)) {
        leftCursor = tree.getChildrenOf(leftCursor)[0];
    }

    while (!tree.isLeaf(rightCursor)) {
        const children = tree.getChildrenOf(rightCursor);
        rightCursor = children[children.length - 1];
    }

    return {
        start: {
            node: leftCursor,
            textPosition: 0,
        },
        end: {
            node: rightCursor,
            textPosition: tree.getTextContent(rightCursor).length,
        },
    };
}
