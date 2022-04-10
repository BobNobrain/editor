import { getAllParents, getDeepestCommonRoot } from '../../document';
import type { ChildNodeIdsList, DocumentData, DocumentNode, NodeDataSupremum } from '../../document/types';
import type { DocumentRange } from '../../range/types';
import type { DocumentEditor } from '../types';
import type { DocumentNodePatch, PatchCreatorArg } from './types';

export interface ExtractedNodeData {
    newNodeId: number;
    clonedNodeIds: Record<number, number>;
}

export interface ExtractIntoNewNodeArg {
    range: DocumentRange;
}

export const extractIntoNewNode = <D extends NodeDataSupremum>(
    { range }: ExtractIntoNewNodeArg,
): DocumentNodePatch<D> => (doc) => {
    const extractionRoot = getDeepestCommonRoot([range.start.nodeId, range.end.nodeId], doc.parentIds);

    const leftChain = getAllParents(range.start.nodeId, doc.parentIds);
    leftChain.length = leftChain.indexOf(extractionRoot) + 1; // cut off everything above extraction root

    const rightChain = getAllParents(range.start.nodeId, doc.parentIds);
    rightChain.length = rightChain.indexOf(extractionRoot) + 1; // cut off everything above extraction root

    // const clonedNodes: Record<number, number> = {};
    const nodesToSplit: SplitNodeInfo[] = [];

    return function undoExtracting(doc: DocumentEditor<D>): DocumentNodePatch<D> {
        return extractIntoNewNode({ range });
    }
};

interface SplitNodeInfo {
    sourceNodeId: number;
    newParentId: number;
    splitIndex: number;
    direction: SplitDirection;
}

enum SplitDirection { Left, Right }

function splitNode<D extends NodeDataSupremum>(doc: DocumentEditor<D>, split: SplitNodeInfo) {
    const parentId = doc.parentIds[split.sourceNodeId];
    const indexInParent = [...(doc.allNodesById[parentId].content as ChildNodeIdsList)].indexOf(split.sourceNodeId);

    // 1. create a copy
    const clone = doc.cloneNode({ nodeId: split.sourceNodeId });

    // 2. insert
    doc.insertSubtree({
        parentId: split.newParentId,
        insertAt: split.direction === SplitDirection.Left ? 0 : doc.allNodesById[split.newParentId].content.length,
        subtree: clone,
    });

    const sourceNode = doc.allNodesById[split.sourceNodeId];
    if (typeof sourceNode.content === 'string') {
        // TODO: 3a. split text content between nodes
        return;
    }

    // 3b. move nodes inside range into their new parent
    let start: number;
    let end: number;
    switch (split.direction) {
        case SplitDirection.Left:
            start = split.splitIndex;
            end = sourceNode.content.length;

        case SplitDirection.Right:
            start = 0;
            end = split.splitIndex;
    }

    for (let i = start; i < end; i++) {
        const childId = sourceNode.content[i];
        doc.moveSubtree({
            sourceNodeId: childId,
            destination: {
                parentNodeId: clone.root.id,
                insertAt: clone.root.content.length,
            },
        });
    }
}
