import { DocumentTree } from '../tree/types';
import { DocumentTreeRange } from './types';

export function isValidSelection(
    selection: DocumentTreeRange,
    tree: DocumentTree<any>,
): boolean {
    if (!tree.isLeaf(selection.start.node) || !tree.isLeaf(selection.end.node)) {
        // selection must point to leafs
        return false;
    }

    return true;
}
