import type { HumanString } from '../../util/HumanString';
import type { MutableDocumentTree } from '../tree/types';

export interface DocumentAction<Data> {
    name: HumanString;

    apply(tree: MutableDocumentTree<Data>): void;
    undo(tree: MutableDocumentTree<Data>): void;
}
