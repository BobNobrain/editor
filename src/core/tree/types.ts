export interface InsertSubtreeIntoPayload<Data> {
    parentNode: number;
    insertAt: number;
    subtree: DocumentTree<Data>;
}

export interface RemoveSubtreeFromPayload {
    parentNode: number;
    removeAt: number;
}

export interface MoveSubtreePayload {
    node: number;
    newParentNode: number;
    insertAt?: number;
}
export interface MoveSubtreeResult {
    oldParentNode: number;
    oldPosition: number;
}

export interface SetTextContentPayload {
    node: number;
    content: string;
}

export interface DocumentTree<Data> {
    readonly root: number;

    getParentOf(node: number): number | undefined;
    getChildrenOf(node: number): ReadonlyArray<number>;
    isLeaf(node: number): boolean;
    getTextContent(node: number): string;

    getNodeData(node: number): Data;
}

export interface InsertNewNodePayload<Data> {
    parent: number;
    insertAt?: number;
    data: Data;
}
export interface InsertNewNodeResult {
    newNode: number;
}

export interface MutableDocumentTree<Data> extends DocumentTree<Data> {
    createNode(nodeData: Data): number;

    insertSubtreeInto(payload: InsertSubtreeIntoPayload<Data>): void;
    removeSubtreeFrom(payload: RemoveSubtreeFromPayload): DocumentTree<Data>;
    removeSubtreeOf(node: number): DocumentTree<Data>;
    moveSubtree(payload: MoveSubtreePayload): MoveSubtreeResult;

    insertNewNode(payload: InsertNewNodePayload<Data>): InsertNewNodeResult;

    setTextContent(payload: SetTextContentPayload): string | DocumentTree<Data>[];
    setNodeData(node: number, data: Data): Data;
}
