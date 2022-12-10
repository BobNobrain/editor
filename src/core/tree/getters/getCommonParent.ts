import type { DocumentTree } from '../types';

export interface GetCommonParentPayload {
    tree: DocumentTree<any>;
    child1: number;
    child2: number;
}

export interface GetCommonParentResult {
    commonParent: number | undefined;
    chain1: number[];
    chain2: number[];
}

export function getCommonParent({
    tree,
    child1,
    child2,
}: GetCommonParentPayload): GetCommonParentResult {
    if (child1 === child2) {
        return {
            commonParent: child1,
            chain1: [child1],
            chain2: [child2],
        };
    }

    const visited1 = new Set<number>([child1]);
    const visited2 = new Set<number>([child2]);

    const chain1: number[] = [child1];
    const chain2: number[] = [child2];

    let c1: number | undefined = child1;
    let c2: number | undefined = child2;
    let commonParent: number | undefined;

    while (c1 !== undefined || c2 !== undefined) {
        if (c1 !== undefined) {
            c1 = tree.getParentOf(c1);

            if (c1 !== undefined) {
                visited1.add(c1);
                chain1.push(c1);

                if (visited2.has(c1)) {
                    commonParent = c1;
                    chain2.length = chain2.indexOf(c1) + 1;
                    break;
                }
            }
        }

        if (c2 !== undefined) {
            c2 = tree.getParentOf(c2);

            if (c2 !== undefined) {
                visited2.add(c2);
                chain2.push(c2);

                if (visited1.has(c2)) {
                    commonParent = c2;
                    chain1.length = chain1.indexOf(c2) + 1;
                    break;
                }
            }
        }
    }

    return {
        commonParent,
        chain1,
        chain2,
    };
}
