import type { NodeDataSupremum } from '../../document';
import type { DocumentNodePatch } from './types';

export function combinePatches<D extends NodeDataSupremum>(ps: DocumentNodePatch<D>[]): DocumentNodePatch<D> {
    return (doc) => {
        const undoPatches: DocumentNodePatch<D>[] = [];
        for (const p of ps) {
            undoPatches.push(p(doc));
        }

        return combinePatches(undoPatches.reverse());
    };
}

export interface MultiPatchCreator<D extends NodeDataSupremum> {
    add(patch: DocumentNodePatch<D>): void;
    clear(): void;
    combine(): DocumentNodePatch<D>;
}

export const createMultiPatch = <D extends NodeDataSupremum>(): MultiPatchCreator<D> => {
    const result: DocumentNodePatch<D>[] = [];

    const creator: MultiPatchCreator<D> = {
        add: (p) => result.push(p),
        clear: () => {
            result.length = 0;
        },
        combine: () => combinePatches(result)
    };
    return creator;
};
