import { createHistory } from './history';

describe('HistoryImpl', () => {
    it('remembers last `limit` items and no more', () => {
        const h = createHistory<number>(4);
        h.record(1);
        h.record(2);
        h.record(3);

        expect(h.getUndoHistory()).toEqual([3, 2, 1]);

        h.record(4);
        h.record(5);

        expect(h.getUndoHistory()).toEqual([5, 4, 3, 2]);
    });

    it('can undo last `limit` items and no more', () => {
        const h = createHistory<number>(3);
        h.record(1);
        h.record(2);

        expect(h.undo()).toBe(2);
        expect(h.undo()).toBe(1);
        expect(h.undo()).toBe(null);

        h.record(1);
        h.record(2);
        h.record(3);
        h.record(4);

        expect(h.undo()).toBe(4);
        expect(h.undo()).toBe(3);
        expect(h.undo()).toBe(2);
        expect(h.undo()).toBe(null);
    });

    it('can redo all undone items and no more', () => {
        const h = createHistory<number>(3);
        h.record(1);
        h.record(2);
        h.record(3);

        h.undo(); // 3
        h.undo(); // 2

        expect(h.redo()).toBe(2);
        expect(h.redo()).toBe(3);
        expect(h.redo()).toBe(null);

        h.record(4);
        h.record(5);

        h.undo(); // 5
        h.undo(); // 4
        h.undo(); // 3
        h.undo(); // null (limit reached)

        expect(h.redo()).toBe(3);
        expect(h.redo()).toBe(4);
        expect(h.redo()).toBe(5);
        expect(h.redo()).toBe(null);
        expect(h.redo()).toBe(null);
    });

    it('cannot redo after new action has been recorded', () => {
        const h = createHistory<number>(3);
        h.record(1);
        h.record(3);

        h.undo();
        h.record(2);
        expect(h.redo()).toBe(null);
    });

    it('returns proper undo and redo history when under limit', () => {
        const h = createHistory<number>(10);

        expect(h.getUndoHistory()).toEqual([]);
        expect(h.getRedoHistory()).toEqual([]);

        for (let i = 0; i < 8; i++) {
            h.record(i);
        }

        expect(h.getUndoHistory()).toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
        expect(h.getRedoHistory()).toEqual([]);

        for (let i = 0; i < 3; i++) {
            h.undo();
        }

        expect(h.getUndoHistory()).toEqual([4, 3, 2, 1, 0]);
        expect(h.getRedoHistory()).toEqual([5, 6, 7]);

        for (let i = 0; i < 10; i++) {
            h.undo();
        }

        expect(h.getUndoHistory()).toEqual([]);
        expect(h.getRedoHistory()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('returns proper undo and redo history when above limit', () => {
        const h = createHistory<number>(6);

        for (let i = 0; i < 10; i++) {
            h.record(i);
        }

        expect(h.getUndoHistory()).toEqual([9, 8, 7, 6, 5, 4]);
        expect(h.getRedoHistory()).toEqual([]);

        for (let i = 0; i < 3; i++) {
            h.undo();
        }

        expect(h.getUndoHistory()).toEqual([6, 5, 4]);
        expect(h.getRedoHistory()).toEqual([7, 8, 9]);

        for (let i = 0; i < 10; i++) {
            h.undo();
        }

        expect(h.getUndoHistory()).toEqual([]);
        expect(h.getRedoHistory()).toEqual([4, 5, 6, 7, 8, 9]);
    });

    it('returns last recorded item when getNextUndo() is called', () => {
        const h = createHistory<number>(2);
        expect(h.getNextUndo()).toBe(null);
        h.record(1);
        expect(h.getNextUndo()).toBe(1);
        expect(h.getNextUndo()).toBe(1);
        h.record(2);
        h.record(3);
        expect(h.getNextUndo()).toBe(3);
    });

    it('returns last undone item when getNextRedo() is called', () => {
        const h = createHistory<number>(2);
        expect(h.getNextRedo()).toBe(null);
        h.record(1);
        expect(h.getNextRedo()).toBe(null);
        h.undo(); // 1
        expect(h.getNextRedo()).toBe(1);
        expect(h.getNextRedo()).toBe(1);
        h.record(1);
        h.record(2);
        h.record(3);
        h.record(4);
        expect(h.getNextRedo()).toBe(null);
        h.undo(); // 4
        h.undo(); // 3
        expect(h.getNextRedo()).toBe(3);
        h.undo(); // null (limit reached)
        expect(h.getNextRedo()).toBe(3);
    });
});
