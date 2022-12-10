export interface DocumentTreePointer {
    node: number;
    textPosition: number;
}

export interface DocumentTreeRange {
    start: DocumentTreePointer;
    end: DocumentTreePointer;
}

export interface DocumentTreeRangeRichInfo extends DocumentTreeRange {
    first: DocumentTreePointer;
    last: DocumentTreePointer;
    commonParent: number;
    isReverse: boolean;
    startChain: number[];
    endChain: number[];
    firstChain: number[];
    lastChain: number[];
}
