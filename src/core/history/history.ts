import { LimitedArray, createLimitedArray } from '../../util/LimitedArray';
import type { MutableBasicHistory } from './types';

export function createHistory<T>(
    limit: number,
): MutableBasicHistory<T> {
    return new MutableHistoryImpl<T>(limit);
}

class MutableHistoryImpl<T> implements MutableBasicHistory<T> {
    private history: LimitedArray<T>;
    private undoneCount = 0;

    constructor(limit: number) {
        this.history = createLimitedArray(limit);
    }

    getNextUndo(): T | null {
        const length = this.history.size();

        const i = length - this.undoneCount - 1;
        if (i < 0) {
            return null;
        }
        return this.history.at(i);
    }
    getNextRedo(): T | null {
        if (this.undoneCount === 0) {
            return null;
        }

        return this.history.at(this.history.size() - this.undoneCount);
    }

    record(action: T): void {
        if (this.undoneCount > 0) {
            this.history.trim(this.history.size() - this.undoneCount);
            this.undoneCount = 0;
        }

        this.history.push(action);
    }

    undo(): T | null {
        const item = this.getNextUndo();
        if (item !== null) {
            ++this.undoneCount;
        }
        return item;
    }
    redo(): T | null {
        const item = this.getNextRedo();
        if (item !== null) {
            --this.undoneCount;
        }
        return item;
    }

    getUndoHistory(): T[] {
        return this.history.slice(0, this.history.size() - this.undoneCount).reverse();
    }

    getRedoHistory(): T[] {
        return this.history.slice(this.history.size() - this.undoneCount);
    }
}
