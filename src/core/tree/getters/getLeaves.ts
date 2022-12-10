import { DocumentTree } from '../types';
import { walk } from '../walk';

export interface GetLeavesPayload {
    tree: DocumentTree<unknown>;
    subtreeRoot?: number;
}

export function getLeaves({
    tree,
    subtreeRoot,
}: GetLeavesPayload): number[] {
    const result: number[] = [];

    walk({ tree, startNode: subtreeRoot, cb(node) {
        if (tree.isLeaf(node)) {
            result.push(node);
        }
    } });

    return result;
}
