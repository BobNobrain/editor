import { createLimitedArray } from './LimitedArray';

describe('LimitedArray', () => {
    it('returns proper size and capacity', () => {
        const larr = createLimitedArray<number>(4);

        expect(larr.size()).toBe(0);
        expect(larr.capacity).toBe(4);

        larr.push(42);
        larr.push(42);

        expect(larr.size()).toBe(2);
        expect(larr.capacity).toBe(4);

        larr.push(42);
        larr.push(42);
        larr.push(42);

        expect(larr.size()).toBe(4);
        expect(larr.capacity).toBe(4);
    });

    it('stores all items under limit', () => {
        const larr = createLimitedArray<number>(10);
        for (let i = 0; i < 6; i++) {
            larr.push(i + 3);
        }

        for (let i = 0; i < 6; i++) {
            expect(larr.at(i)).toBe(i + 3);
        }
    });

    it('stores last `limit` items', () => {
        const larr = createLimitedArray<number>(2);
        larr.push(42);
        larr.push(42);
        larr.push(42);
        larr.push(101);
        larr.push(202);

        expect(larr.at(0)).toBe(101);
        expect(larr.at(1)).toBe(202);
    });

    it('properly retrieves last item', () => {
        const larr = createLimitedArray<number>(3);

        larr.push(0);
        larr.push(42);

        expect(larr.last()).toBe(42);

        larr.push(0);
        larr.push(58);

        expect(larr.last()).toBe(58);
    });

    it('creates an array in correct order via ::slice', () => {
        const larr = createLimitedArray<number>(5);

        for (let i = 0; i < 12; i++) {
            larr.push(i);
        }

        expect(larr.slice()).toEqual([7, 8, 9, 10, 11]);
    });

    it('correctly uses start and end index in ::slice', () => {
        const larr = createLimitedArray<number>(4);

        for (let i = 0; i < 10; i++) {
            larr.push(i);
        }

        expect(larr.slice(1)).toEqual([7, 8, 9]);
        expect(larr.slice(0, 2)).toEqual([6, 7]);
        expect(larr.slice(1, 3)).toEqual([7, 8]);
        expect(larr.slice(0, 0)).toEqual([]);
        expect(larr.slice(2, 2)).toEqual([]);
    });

    it('trims to specified amount of items if asked', () => {
        const larr = createLimitedArray<number>(10);
        for (let i = 0; i < 4; i++) {
            larr.push(i);
        }

        larr.trim(6);
        expect(larr.size()).toBe(4);
        expect(larr.slice()).toEqual([0, 1, 2, 3]);

        larr.trim(2);
        expect(larr.size()).toBe(2);
        expect(larr.slice()).toEqual([2, 3]);

        for (let i = 0; i < 16; i++) {
            larr.push(i);
        }

        larr.trim(4);
        expect(larr.size()).toBe(4);
        expect(larr.slice()).toEqual([12, 13, 14, 15]);
    });
});
