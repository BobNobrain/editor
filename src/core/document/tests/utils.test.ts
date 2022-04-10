import { getAllParents, getDeepestCommonRoot } from '../utils';

describe('getAllParents', () => {
    it('returns all parent node ids from the deepest to the root, including node itself', () => {
        const parentIds: Record<number, number> = {
            1: 0,
            2: 0,
            3: 2,
            4: 2,
            5: 3,
            6: 3,
            7: 3,
            42: 6,
        };

        expect(getAllParents(42, parentIds)).toEqual([42, 6, 3, 2, 0]);
    });
    it('returns signleton when node id has no parent', () => {
        expect(getAllParents(42, {})).toEqual([42]);
    });
});

describe('getDeepestCommonRoot', () => {
    it('finds the deepest root available', () => {
        const parentIds: Record<number, number> = {
            1: 0,
            2: 0,
            3: 2,
            4: 2,
            5: 3,
            6: 3,
            7: 3,
            8: 2,
            9: 8,
            42: 6,
            43: 9,
        };

        expect(getDeepestCommonRoot([42, 43], parentIds)).toBe(2);
    });

    it('handles case when one of provided child ids is an answer', () => {
        const parentIds: Record<number, number> = {
            1: 0,
            2: 0,
            3: 2,
            4: 2,
            5: 3,
            6: 3,
            7: 3,
        };

        expect(getDeepestCommonRoot([6, 2, 7, 4], parentIds)).toBe(2);
    });

    it('returns NaN when there is no common root', () => {
        const parentIds: Record<number, number> = {
            1: 0,
            2: 0,
            4: 3,
            5: 3,
            6: 3,
            7: 3,
        };

        expect(getDeepestCommonRoot([1, 5], parentIds)).toBe(NaN);
    });
});
