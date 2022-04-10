import { DocumentData, DocumentNode, NodeDataSupremum } from "./types";

export function removeSubtree<D extends NodeDataSupremum>(
    tree: DocumentData<D>,
    subtreeRootId: number,
): void {
    removeNodeRecursive(tree, tree.nodes[subtreeRootId]);
}

function removeNodeRecursive<D extends NodeDataSupremum>(
    tree: DocumentData<D>,
    node: DocumentNode,
) {
    delete tree.nodes[node.id];

    if (tree.nodeData[node.type]) {
        delete tree.nodeData[node.type]![node.id];
    }

    if (typeof node.content === 'string') {
        return;
    }

    for (const childId of node.content) {
        removeNodeRecursive(tree, tree.nodes[childId]);
    }
}
