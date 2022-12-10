import { DocumentTreePointer } from '../../selection/types';
import type { MutableDocumentTree } from '../types';

interface PayloadBase<Data> {
    tree: MutableDocumentTree<Data>;
    splitPoint: DocumentTreePointer;
    direction?: 'left' | 'right';
}
interface PayloadSimple<Data> extends PayloadBase<Data> {
    data: Data;
    getData?: undefined;
}
interface PayloadFunction<Data> extends PayloadBase<Data> {
    data?: undefined;
    getData: (originalData: Data) => Data;
}
export type SplitLeafPayload<Data> = PayloadSimple<Data> | PayloadFunction<Data>;

export interface SplitLeafResult<Data> {
    newNode: number;
    newNodeData: Data;
}

export function splitLeaf<Data>(p: SplitLeafPayload<Data>): SplitLeafResult<Data> {
    const { tree, splitPoint: { node, textPosition }, direction = 'right' } = p;

    if (!tree.isLeaf(node)) {
        throw new TypeError(`cannot split #${node} that is not a leaf`);
    }

    const text = tree.getTextContent(node);
    const leftText = text.substring(0, textPosition);
    const rightText = text.substring(textPosition, text.length);

    let leftNode: number;
    let rightNode: number;

    const newNodeData = p.getData
        ? p.getData(tree.getNodeData(node))
        : p.data;
    const newNode = tree.createNode(newNodeData);

    switch (direction) {
        case 'left':
            leftNode = newNode;
            rightNode = node;
            break;

        case 'right':
            leftNode = node;
            rightNode = newNode;
            break;
    }

    tree.setTextContent({
        node: leftNode,
        content: leftText,
    });
    tree.setTextContent({
        node: rightNode,
        content: rightText,
    });

    return {
        newNode,
        newNodeData,
    };
}
