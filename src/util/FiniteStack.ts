export interface FiniteStack<T> {
    push(value: T): void;
    pop(): T;
    size: number;
}

export function createFiniteStack<T>(limit: number): FiniteStack<T> {
    const content: T[] = new Array(limit);
    let cursor = 0;

    const stack: FiniteStack<T> = {
        size: 0,
        push(value) {
            content[cursor] = value;
            cursor++;
            if (cursor > limit) {
                cursor = 0;
            }

            stack.size = Math.min(stack.size + 1, limit);
        },
        pop() {
            if (stack.size === 0) {
                return undefined as never;
            }
            stack.size--;
            cursor--;
            if (cursor < 0) {
                cursor = limit - 1;
            }
            const item = content[cursor];
            content[cursor] = undefined as never;
            return item;
        },
    };

    return stack;
}
