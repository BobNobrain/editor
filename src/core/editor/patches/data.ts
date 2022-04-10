import type { NodeDataSupremum } from '../../document';
import type { DocumentEditor } from '../../editor/types';
import type { DocumentNodePatch, PatchCreatorArg } from './types';

export interface SetNodeDataArg<D extends NodeDataSupremum, T extends keyof D> extends PatchCreatorArg {
    nodeData: D[T];
}
export const setNodeData = <D extends NodeDataSupremum, T extends keyof D>(
    { nodeId, nodeData }: SetNodeDataArg<D, T>,
) => (doc: DocumentEditor<D>): DocumentNodePatch<D> => {
    const nodeType = doc.allNodesById[nodeId].type;
    const registry = doc.nodeData[nodeType];

    if (registry && (nodeId in registry)) {
        const oldData = registry[nodeId];
        doc.setNodeData(nodeId, nodeData);
        return setNodeData({
            nodeId,
            nodeData: oldData,
        });
    }

    doc.setNodeData(nodeId, nodeData);
    return (doc) => {
        doc.clearNodeData(nodeId);
        return setNodeData({ nodeId, nodeData });
    };
};
