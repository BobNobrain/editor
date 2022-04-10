import { createFiniteStack } from './FiniteStack';

describe('FiniteStack', () => {
    it('acts like a stack under limit', () => {
        const s = createFiniteStack<number>(10);
        s.push(42);
        s.push(3);
        s.push(666);

        expect(s.pop()).toBe(666);
        expect(s.pop()).toBe(3);
        expect(s.pop()).toBe(42);
        expect(s.pop()).toBe(undefined);
    });

    it('keeps track of its size', () => {
        const s = createFiniteStack<42>(3);
        expect(s.size).toBe(0);

        s.push(42);
        s.push(42);
        expect(s.size).toBe(2);

        s.pop();
        expect(s.size).toBe(1);

        s.push(42);
        s.push(42);
        expect(s.size).toBe(3);

        s.push(42);
        expect(s.size).toBe(3);

        s.pop();
        s.pop();
        s.pop();
        s.pop();
        expect(s.size).toBe(0);
    });

    it('properly pops items after overflow', () => {
        const s = createFiniteStack<number>(2);

        s.push(1);
        s.push(2);
        s.push(3);
        s.push(4);
        s.push(5);

        expect(s.pop()).toBe(5);
        expect(s.pop()).toBe(4);
        expect(s.pop()).toBe(undefined);
    });
});
