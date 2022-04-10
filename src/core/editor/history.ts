import { Listenable, Event, createEvent } from '../../util/event';
import { createFiniteStack } from '../../util/FiniteStack';
import type { DocumentNodePatch } from './patches/types';
import type { NodeDataSupremum } from '../document/types';
import type { DocumentEditor } from './types';

export interface EditorHistory {
    canUndo: boolean;
    canRedo: boolean;
    undo(): void;
    redo(): void;
    changed: Listenable<EditorHistory>;
}

export interface EditorHistoryInternal<D extends NodeDataSupremum> extends EditorHistory {
    record(patch: DocumentNodePatch<D>): void;
    changed: Event<EditorHistory>;
}

interface CreateHistoryOptions<D extends NodeDataSupremum> {
    maxCapacity: number;
    editor: DocumentEditor<D>;
}

export function createEditorHistory<D extends NodeDataSupremum>(
    { maxCapacity, editor }: CreateHistoryOptions<D>,
): EditorHistoryInternal<D> {
    const undoStack = createFiniteStack<DocumentNodePatch<D>>(maxCapacity);
    const redoStack: DocumentNodePatch<D>[] = [];

    const changed = createEvent<EditorHistory>();

    const history: EditorHistoryInternal<D> = {
        canUndo: false,
        canRedo: false,

        changed,

        undo() {
            if (!undoStack.size) {
                return;
            }

            const patch = undoStack.pop()!;
            const reverse = patch(editor);
            redoStack.push(reverse);

            history.canUndo = Boolean(undoStack.size);
            history.canRedo = true;

            changed.trigger(history);
        },
        redo() {
            if (!redoStack.length) {
                return;
            }

            const patch = redoStack.pop()!;
            const reverse = patch(editor);
            undoStack.push(reverse);

            history.canUndo = true;
            history.canRedo = Boolean(redoStack.length);

            changed.trigger(history);
        },

        record(patch) {
            undoStack.push(patch);

            if (redoStack.length) {
                redoStack.length = 0;
            }

            history.canUndo = true;
            history.canRedo = false;

            changed.trigger(history);
        },
    };

    return history;
}
