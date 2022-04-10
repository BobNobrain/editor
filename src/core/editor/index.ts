import { createEvent } from '../../util/event';
import { copySubtree } from '../document/copySubtree';
import { removeSubtree } from '../document/removeSubtree';
import { traverse } from '../document/traverse';
import type { DocumentNode, DocumentData, MutableDocumentNode } from '../document/types';
import { createEditorHistory, EditorHistoryInternal } from './history';
import type { DocumentNodePatch } from './patches/types';
import type { DocumentEditor } from './types';

interface EditorImpl<NodeDataTypes extends Record<string, unknown>> extends DocumentEditor<NodeDataTypes> {
    history: EditorHistoryInternal<NodeDataTypes>;
}

export interface CreateAstEditorOptions {
    maxHistorySize?: number;
}

export function createAstEditor<NodeDataTypes extends Record<string, unknown>>(
    document: DocumentData<NodeDataTypes>,
    {
        maxHistorySize = 30,
    }: CreateAstEditorOptions = {},
): DocumentEditor<NodeDataTypes> {
    let seq = 1;

    const allNodesById = document.nodes as Record<number, MutableDocumentNode>;
    const parentIds: Record<number, number> = {};
    const nodeData = document.nodeData;

    traverse(document.root, document.nodes, (node) => {
        seq = Math.max(seq, node.id + 1);

        if (typeof node.content !== 'string') {
            for (const child of node.content) {
                parentIds[child] = node.id;
            }
        }
    });

    const documentUpdated = createEvent<void>();

    const getNextId = () => seq++;

    const createNodeBase = (type: string): DocumentNode => {
        const node = {
            id: seq++,
            type,
            content: [],
        };
        allNodesById[node.id] = node;
        return node;
    };

    const editor: EditorImpl<NodeDataTypes> = {
        document,
        allNodesById: allNodesById,
        parentIds,
        nodeData,

        documentUpdated,

        history: null as unknown as EditorHistoryInternal<NodeDataTypes>, // will be created slightly later

        getNextId,
        createNodeBase,

        insertSubtree: ({ parentId, subtree, insertAt }) => {
            const children = allNodesById[parentId].content;
            if (typeof children === 'string') {
                throw new TypeError('Cannot insert a child node into string content');
            }

            children.splice(insertAt, 0, subtree.root.id);

            copySubtree(subtree, subtree.root.id, document);

            return subtree.root;
        },
        removeSubtree: ({ parentId, removeAt }) => {
            const children = allNodesById[parentId].content;
            if (typeof children === 'string') {
                throw new TypeError('Cannot remove a child node from string content');
            }

            const childId = children[removeAt];

            const copy = copySubtree(document, childId);
            removeSubtree(document, childId);
            return copy;
        },
        moveSubtree: ({ sourceNodeId, destination }) => {
            const oldParentId = parentIds[sourceNodeId];
            const oldChildren = allNodesById[oldParentId].content;
            const newChildren = allNodesById[destination.parentNodeId].content;

            if (typeof oldChildren === 'string') {
                throw new TypeError('Cannot move a node from string content');
            }
            if (typeof newChildren === 'string') {
                throw new TypeError('Cannot move a node into string content');
            }

            const childIndex = oldChildren.indexOf(sourceNodeId);
            oldChildren.splice(childIndex, 1);
            newChildren.splice(destination.insertAt, 0, sourceNodeId);

            parentIds[sourceNodeId] = destination.parentNodeId;

            return allNodesById[sourceNodeId];
        },

        cloneNode: ({ nodeId, ignoreData }) => {
            const sourceNode = allNodesById[nodeId];
            const clonedNode = editor.createNodeBase(sourceNode.type);
            const subtree: DocumentData<NodeDataTypes> = {
                root: clonedNode,
                nodes: { [clonedNode.id]: clonedNode },
                nodeData: {},
            };
            if (!ignoreData && nodeData[clonedNode.type] && (nodeId in nodeData[clonedNode.type]!)) {
                subtree.nodeData[clonedNode.type as keyof NodeDataTypes] = {
                    [nodeId]: nodeData[clonedNode.type]![nodeId],
                };
            }
            return subtree;
        },

        setNodeData: (nodeId, newData) => {
            const nodeType = allNodesById[nodeId].type;
            if (!nodeData[nodeType as never]) {
                nodeData[nodeType as never as keyof NodeDataTypes] = {};
            }
            nodeData[nodeType as never as keyof NodeDataTypes]![nodeId] = newData;
        },
        clearNodeData: (nodeId) => {
            const type = allNodesById[nodeId].type;
            if (nodeData[type]) {
                delete nodeData[type]![nodeId];
            }
        },

        updateDocument: (patch: DocumentNodePatch<NodeDataTypes>) => {
            editor.history.record(patch);
            documentUpdated.trigger();
        },
    };

    editor.history = createEditorHistory({
        maxCapacity: maxHistorySize,
        editor,
    });

    return editor;
}
