import type { MutableDocumentTree } from '../types';

interface PayloadBase<Data> {
    tree: MutableDocumentTree<Data>;
    node: number;
    splitIndex: number;
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
export type SplitNodePayload<Data> = PayloadSimple<Data> | PayloadFunction<Data>;

export interface SplitNodeResult<Data> {
    newNode: number;
    newNodeData: Data;
}

export function splitNode<Data>(p: SplitNodePayload<Data>): SplitNodeResult<Data> {
    const { tree, node, splitIndex, direction = 'right' } = p;

    const children = tree.getChildrenOf(node);
    if (!children.length && tree.getTextContent(node)) {
        throw new TypeError(`cannot split text node #${node}`);
    }

    const oldNodeData = tree.getNodeData(node);
    const newNodeData = p.getData
        ? p.getData(oldNodeData)
        : oldNodeData
    ;

    const newNode = tree.createNode(newNodeData);
    let childrenToMove: number[];

    switch (direction) {
        case 'left':
            childrenToMove = children.slice(0, splitIndex);
            break;

        case 'right':
            childrenToMove = children.slice(splitIndex, children.length);
            break;
    }

    for (const child of childrenToMove) {
        tree.moveSubtree({
            node: child,
            newParentNode: newNode,
        });
    }

    return {
        newNode,
        newNodeData,
    };
}
