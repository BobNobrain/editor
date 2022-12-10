export interface LimitedArray<T> {
    readonly capacity: number;
    size(): number;

    at(index: number): T;
    last(): T;

    push(item: T): void;
    slice(start?: number, end?: number): T[];

    trim(newSize: number): void;
}

export function createLimitedArray<T>(capacity: number): LimitedArray<T> {
    return new LimitedArrayImpl(capacity);
}

class LimitedArrayImpl<T> implements LimitedArray<T> {
    private items: T[] = [];
    private cursor = 0;

    public constructor(
        public capacity: number,
    ) {}

    public size() {
        return this.items.length;
    }

    public at(index: number): T {
        return this.items[this.index(index)];
    }
    public last(): T {
        return this.items[this.index(this.items.length - 1)]
    }

    public push(item: T) {
        this.items[this.cursor] = item;
        this.cursor = (this.cursor + 1) % this.capacity;
    }

    public slice(start = 0, end = this.items.length): T[] {
        const result: T[] = [];
        for (let i = start; i < end; i++) {
            const ri = this.index(i);
            result.push(this.items[ri]);
        }
        return result;
    }

    public trim(newSize: number) {
        if (this.items.length > newSize) {
            this.items = this.slice(this.items.length - newSize);
        }
    }

    private index(i: number): number {
        return (this.cursor + i) % this.items.length;
    }
}
