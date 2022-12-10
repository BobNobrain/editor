import { Listenable } from '../../util/event';
import { DocumentAction } from '../actions/types';
import { DocumentHistory } from '../history';
import { DocumentTree } from '../tree/types';

export interface DocumentEditor<Data> {
    readonly history: DocumentHistory<Data>;
    readonly document: DocumentTree<Data>;

    update(action: DocumentAction<Data>): void;

    undo(): void;
    redo(): void;

    readonly updated: Listenable<void>;
}
