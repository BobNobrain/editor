import { DocumentNode, MutableDocumentNode } from './types';

export function cloneNodeObject(node: DocumentNode): MutableDocumentNode {
    return {
        ...node,
        content: typeof node.content === 'string'
            ? node.content
            : [...node.content]
        ,
    };
}

export function getAllParents(node: number, parentIds: Record<number, number>): number[] {
    const result: number[] = [node];
    let cursor: number = parentIds[node];

    while (cursor !== undefined) {
        result.push(cursor);
        cursor = parentIds[cursor];
    }

    return result;
}

export function getDeepestCommonRoot(children: number[], parentIds: Record<number, number>): number {
    const parentChains = children.map((child) => getAllParents(child, parentIds).reverse());
    let deepestCommonRootIndex = 0;
    let result = NaN;

    while (true) {
        const currentValue = parentChains[0][deepestCommonRootIndex];

        if (currentValue === undefined) {
            return result;
        }

        for (const parentChain of parentChains) {
            if (parentChain[deepestCommonRootIndex] !== currentValue) {
                return result;
            }
        }

        result = currentValue;
        ++deepestCommonRootIndex;
    }
}
