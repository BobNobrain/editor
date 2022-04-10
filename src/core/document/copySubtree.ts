import { DocumentData, DocumentNode, NodeDataSupremum } from './types';
import { cloneNodeObject } from './utils';

export interface CopySubtreeOptions {
    cloneNodeObjects?: boolean;
}

export function copySubtree<D extends NodeDataSupremum>(
    copyFrom: DocumentData<D>,
    subtreeRootId: number,
    copyInto?: DocumentData<D>,
    opts?: CopySubtreeOptions,
): DocumentData<D> {
    const newRoot = copyFrom.nodes[subtreeRootId];
    const copy: DocumentData<D> = copyInto ?? {
        root: newRoot,
        nodes: {},
        nodeData: {},
    };

    copyNodeRecursive(copyFrom, copy, newRoot);

    return copy;
}

function copyNodeRecursive<D extends NodeDataSupremum>(
    src: DocumentData<D>,
    dest: DocumentData<D>,
    node: DocumentNode,
    { cloneNodeObjects = false }: CopySubtreeOptions = {}
) {
    dest.nodes[node.id] = cloneNodeObjects ? cloneNodeObject(node) : node;

    if (src.nodeData[node.type] && (node.id in src.nodeData[node.type]!)) {
        if (!dest.nodeData[node.type]) {
            dest.nodeData[node.type as keyof D] = {};
        }
        dest.nodeData[node.type]![node.id] = src.nodeData[node.type]![node.id];
    }

    if (typeof node.content === 'string') {
        return;
    }
    for (const childId of node.content) {
        copyNodeRecursive(src, dest, src.nodes[childId]);
    }
}
