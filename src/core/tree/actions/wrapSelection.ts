import { enrichRange } from '../../selection/enrich';
import { isValidSelection } from '../../selection/isValidSelection';
import { DocumentTreeRange, DocumentTreeRangeRichInfo } from '../../selection/types';
import { getCommonParent } from '../getters/getCommonParent';
import type { MutableDocumentTree } from '../types';

interface PayloadBase<Data> {
    tree: MutableDocumentTree<Data>;
    selection: DocumentTreeRange;
}
interface PayloadSimple<Data> extends PayloadBase<Data> {
    data: Data;
    getData?: undefined;
}
interface PayloadFunction<Data> extends PayloadBase<Data> {
    data?: undefined;
    getData: (originalData: Data, originalNode: number) => Data;
}
export type WrapSelectionPayload<Data> = PayloadSimple<Data> | PayloadFunction<Data>;

export interface WrapSelectionResult {
    /** Id of newly created node that wraps the selection */
    newSelectionRoot: number;
    /** Maps original node id to cloned node id */
    clonedNodes: Record<number, number>;
}

interface WrapSelectionContext<Data> {
    tree: MutableDocumentTree<Data>;
    selectionInfo: DocumentTreeRangeRichInfo;
    clonedNodes: Record<number, number>;
    newSelectionRoot: number | undefined;
    getData: (node: number) => Data;
}

export function wrapSelection<Data>(p: WrapSelectionPayload<Data>): WrapSelectionResult {
    const { tree, selection } = p;
    if (!isValidSelection(selection, tree)) {
        throw new Error('selection must point to leafs');
    }

    const getData = p.getData
        ? (node: number) => p.getData(tree.getNodeData(node), node)
        : () => p.data
    ;

    if (selection.start.node === selection.end.node) {
        // TODO: handle this special case
    }

    const selectionInfo = enrichRange(tree, p.selection);
    const ctx: WrapSelectionContext<Data> = {
        tree,
        selectionInfo,
        clonedNodes: {},
        newSelectionRoot: undefined,
        getData,
    };

    startDoubleCut(ctx);
    cutChain(ctx, selectionInfo.firstChain);
    cutChain(ctx, selectionInfo.lastChain);

    return {
        newSelectionRoot: ctx.newSelectionRoot!,
        clonedNodes: ctx.clonedNodes,
    };
}

function startDoubleCut<Data>(ctx: WrapSelectionContext<Data>) {
    const { tree, selectionInfo, getData } = ctx;

    const selectionRootChildren = tree.getChildrenOf(selectionInfo.commonParent);
    const firstAffectedChildIndex = selectionRootChildren.indexOf(
        selectionInfo.firstChain[selectionInfo.firstChain.length - 2],
    );
    const lastAffectedChildIndex = selectionRootChildren.indexOf(
        selectionInfo.lastChain[selectionInfo.lastChain.length - 2],
    );

    const affectedChildren = selectionRootChildren.slice(firstAffectedChildIndex, lastAffectedChildIndex + 1);

    const { newNode } = tree.insertNewNode({
        data: getData(selectionInfo.commonParent),
        parent: selectionInfo.commonParent,
        insertAt: firstAffectedChildIndex,
    });
    ctx.newSelectionRoot = newNode;

    for (const child of affectedChildren) {
        tree.moveSubtree({
            node: child,
            newParentNode: newNode,
        });
    }
}

function cutChain<Data>(ctx: WrapSelectionContext<Data>, chain: number[]) {
    let cursorNode = ctx.newSelectionRoot!;
    for (let i = chain.length - 2; i >= 0; i--) {}
}
