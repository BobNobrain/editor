import { getCommonParent } from '../tree/getters/getCommonParent';
import { DocumentTree } from '../tree/types';
import { DocumentTreeRange, DocumentTreeRangeRichInfo } from './types';

export function enrichRange(tree: DocumentTree<unknown>, { start, end }: DocumentTreeRange): DocumentTreeRangeRichInfo {
    if (start.node === end.node) {
        const startChain = [start.node];
        const endChain = [end.node];
        const result: DocumentTreeRangeRichInfo = {
            start, end,
            commonParent: start.node,
            isReverse: false,
            first: start, last: end,
            startChain, endChain,
            firstChain: startChain, lastChain: endChain,
        };

        if (start.textPosition > end.textPosition) {
            result.isReverse = true;
            result.first = end;
            result.last = start;
            result.firstChain = endChain;
            result.lastChain = startChain;
        }
    }

    const { commonParent, chain1: startChain, chain2: endChain } = getCommonParent({
        tree,
        child1: start.node,
        child2: end.node,
    });

    if (commonParent === undefined) {
        throw new ReferenceError('provided selection is invalid!');
    }

    const upmostChildren = tree.getChildrenOf(commonParent);
    const iStart = upmostChildren.indexOf(startChain[startChain.length - 2]);
    const iEnd = upmostChildren.indexOf(endChain[endChain.length - 2]);
    const isReverse = iStart > iEnd;

    const result: DocumentTreeRangeRichInfo = {
        start, end,
        commonParent,
        isReverse,
        first: start, last: end,
        startChain, endChain,
        firstChain: startChain, lastChain: endChain,
    };

    if (isReverse) {
        result.first = end;
        result.firstChain = endChain;
        result.last = start;
        result.lastChain = startChain;
    }

    return result;
}
