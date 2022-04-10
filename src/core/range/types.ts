export interface DocumentPointer {
    nodeId: number;
    offset: number;
}

export interface DocumentRange {
    start: DocumentPointer;
    end: DocumentPointer;
}
