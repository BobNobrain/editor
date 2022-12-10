import { DocumentAction } from '../actions/types';

export interface BasicHistory<T> {
    getNextUndo(): T | null;
    getNextRedo(): T | null;

    getUndoHistory(): T[];
    getRedoHistory(): T[];
}

export interface MutableBasicHistory<T> extends BasicHistory<T> {
    record(action: T): void;

    undo(): T | null;
    redo(): T | null;
}

export type DocumentHistory<Data> = BasicHistory<DocumentAction<Data>>;
export type MutableDocumentHistory<Data> = MutableBasicHistory<DocumentAction<Data>>;
