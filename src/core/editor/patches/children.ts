import type { DocumentData, NodeDataSupremum } from '../../document';
import type { DocumentNodePatch, PatchCreator, PatchCreatorArg } from './types';

export interface InsertChildNodeArg<D extends NodeDataSupremum> extends PatchCreatorArg {
    insertAt: number;
    subtree: DocumentData<D>;
}
export const insertChildNode = <D extends NodeDataSupremum>(
    { nodeId, insertAt, subtree }: InsertChildNodeArg<D>,
): DocumentNodePatch<D> => (doc) => {
    const node = doc.allNodesById[nodeId];
    if (typeof node.content === 'string') {
        throw new TypeError('Node content is a string');
    }

    doc.insertSubtree({
        insertAt,
        subtree,
        parentId: nodeId,
    });

    return removeChildNode({
        nodeId,
        removeAt: insertAt,
    });
};

export interface RemoveChildNodeArg extends PatchCreatorArg {
    removeAt: number;
}
export const removeChildNode: PatchCreator<RemoveChildNodeArg> = ({ nodeId, removeAt }) => (doc) => {
    const node = doc.allNodesById[nodeId];
    if (typeof node.content === 'string') {
        throw new TypeError('Node content is a string');
    }

    const removedTree = doc.removeSubtree({
        parentId: nodeId,
        removeAt,
    });

    return insertChildNode({
        nodeId,
        subtree: removedTree,
        insertAt: removeAt,
    });
};
