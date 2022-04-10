import type { Listenable } from '../../util/event';
import type { DocumentNodePatch } from './patches/types';
import type { DocumentNode, DocumentData, DocumentNodeDataRegistries, NodeDataSupremum } from '../document/types';
import type { EditorHistory } from './history';

export interface InsertSubtreeAction<NodeDataTypes extends NodeDataSupremum> {
    parentId: number;
    insertAt: number;
    subtree: DocumentData<NodeDataTypes>;
}
export interface RemoveSubtreeAction {
    parentId: number;
    removeAt: number;
}
export interface MoveSubtreeAction {
    sourceNodeId: number;
    destination: {
        parentNodeId: number;
        insertAt: number;
    };
}
export interface SetNodeContentPayload {
    nodeId: number;
    newContent: string | never[];
}
export interface CloneNodeAction {
    nodeId: number;
    ignoreData?: boolean;
}

export interface DocumentEditor<NodeDataTypes extends Record<string, unknown>> {
    readonly document: DocumentData<NodeDataTypes>;

    readonly allNodesById: Record<number, DocumentNode>;
    readonly parentIds: Record<number, number>;

    readonly nodeData: DocumentNodeDataRegistries<NodeDataTypes>;

    readonly documentUpdated: Listenable<void>;

    readonly history: EditorHistory;

    getNextId(): number;
    createNodeBase(type: string): DocumentNode;

    insertSubtree(payload: InsertSubtreeAction<NodeDataTypes>): DocumentNode;
    removeSubtree(payload: RemoveSubtreeAction): DocumentData<NodeDataTypes>;
    moveSubtree(payload: MoveSubtreeAction): DocumentNode;

    setNodeData<NodeType extends keyof NodeDataTypes>(
        nodeId: number,
        newData: NodeDataTypes[NodeType],
    ): void;
    clearNodeData(nodeId: number): void;

    cloneNode(payload: CloneNodeAction): DocumentData<NodeDataTypes>;

    updateDocument(patch: DocumentNodePatch<NodeDataTypes>): void;
}
