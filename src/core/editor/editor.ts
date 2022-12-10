import { createEvent, Event } from '../../util/event';
import { DocumentAction } from '../actions/types';
import { createDocumentHistory, MutableDocumentHistory } from '../history';
import { MutableDocumentTree } from '../tree/types';
import { DocumentEditor } from './types';

export interface CreateEditorOptions<Data> {
    doc: MutableDocumentTree<Data>;
    maxHistoryDepth?: number;
}

export function createEditor<Data>(opts: CreateEditorOptions<Data>): DocumentEditor<Data> {
    return new EditorImpl<Data>(opts);
}

class EditorImpl<Data> implements DocumentEditor<Data> {
    public history: MutableDocumentHistory<Data>;
    public updated: Event<void> = createEvent();
    public document: MutableDocumentTree<Data>;

    public constructor({
        maxHistoryDepth = 100,
        doc,
    }: CreateEditorOptions<Data>) {
        this.history = createDocumentHistory(maxHistoryDepth);
        this.document = doc;
    }

    public update(action: DocumentAction<Data>): void {
        action.apply(this.document);
        this.history.record(action);
    }
    public undo(): void {
        const action = this.history.undo();
        if (action) {
            action.undo(this.document);
        }
    }
    public redo(): void {
        const action = this.history.redo();
        if (action) {
            action.apply(this.document);
        }
    }
}
