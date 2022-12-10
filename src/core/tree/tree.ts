import { TraversalController, traverse, traverseVoid } from './traverse';
import {
    DocumentTree,
    MutableDocumentTree,
    InsertSubtreeIntoPayload,
    MoveSubtreePayload,
    RemoveSubtreeFromPayload,
    SetTextContentPayload,
    InsertNewNodePayload,
    InsertNewNodeResult,
} from './types';

const NO_CHILDREN: ReadonlyArray<number> = [];

export function createMutableDocumentTree<Data>(
    rootData: Data,
    source?: DocumentTree<Data>,
): MutableDocumentTree<Data> {
    return new MutableDocumentTreeImpl<Data>(rootData, source);
}

class MutableDocumentTreeImpl<Data> implements MutableDocumentTree<Data> {
    public root = 0;

    private allParents: Record<number, number> = {};
    private allChildren: Record<number, number[]> = {};
    private allTextContents: Record<number, string> = {};
    private allNodeData: Record<number, Data> = {};
    private nextChild = 1;

    constructor(rootData: Data, source?: DocumentTree<Data>) {
        this.allNodeData[this.root] = rootData;

        if (source) {
            this.root = source.root;
            traverseVoid(source, this.copy);
        }
    }

    public createNode(data: Data) {
        const node = this.nextChild;
        this.nextChild++;
        this.allNodeData[node] = data;
        return node;
    }
    public getChildrenOf(node: number) { return this.allChildren[node] ?? NO_CHILDREN }
    public getParentOf(node: number) { return this.allParents[node] };
    public isLeaf(node: number) { return !this.allChildren[node]?.length }
    public getTextContent(node: number) { return this.allTextContents[node] ?? '' }

    public setTextContent({ node, content }: SetTextContentPayload) {
        let result: string | DocumentTree<Data>[];
        const children = this.allChildren[node];
        if (children?.length) {
            result = children.map((child) => this.removeSubtreeOf(child));
        } else {
            result = this.allTextContents[node] ?? '';
        }

        this.allTextContents[node] = content;
        return result;
    }

    public getNodeData(node: number): Data {
        return this.allNodeData[node];
    }
    public setNodeData(node: number, data: Data): Data {
        const oldData = this.allNodeData[node];
        this.allNodeData[node] = data;
        return oldData;
    }

    public insertSubtreeInto({ insertAt, parentNode, subtree }: InsertSubtreeIntoPayload<Data>) {
        this.assertNotTextNode(parentNode);

        this.getMutableChildren(parentNode).splice(insertAt, 0, subtree.root);
        traverseVoid(subtree, this.copy);
    }

    public moveSubtree({ newParentNode, insertAt, node }: MoveSubtreePayload) {
        this.assertNotTextNode(newParentNode);

        const oldParentNode = this.requireParent(node);;
        const siblings = this.allChildren[oldParentNode];
        const oldPosition = siblings.indexOf(node)
        siblings.splice(oldPosition, 1);

        const children = this.getMutableChildren(newParentNode);
        children.splice(insertAt ?? children.length, 0, node);

        return {
            oldPosition,
            oldParentNode,
        };
    }

    public removeSubtreeOf(node: number): DocumentTree<Data> {
        const newSubtree = new MutableDocumentTreeImpl<Data>(this.allNodeData[node]);
        traverseVoid(this, (node, ctx) => {
            newSubtree.copy(node, ctx);

            delete this.allChildren[node];
            delete this.allParents[node];
            delete this.allTextContents[node];
            delete this.allNodeData[node];
        }, node);

        return newSubtree;
    }
    public removeSubtreeFrom({ parentNode, removeAt }: RemoveSubtreeFromPayload): DocumentTree<Data> {
        return this.removeSubtreeOf(this.allChildren[parentNode][removeAt]);
    }

    public insertNewNode({ data, parent, insertAt }: InsertNewNodePayload<Data>): InsertNewNodeResult {
        const newNode = this.createNode(data);
        this.allParents[newNode] = parent;

        const siblings = this.getMutableChildren(parent);
        siblings.splice(insertAt ?? siblings.length, 0, newNode);
        return { newNode };
    }

    private copy = (sourceNode: number, { tree: sourceTree }: TraversalController) => {
        if (sourceNode >= this.nextChild) {
            this.nextChild = sourceNode + 1;
        }

        this.allChildren[sourceNode] = sourceTree.getChildrenOf(sourceNode).slice();
        const parent = sourceTree.getParentOf(sourceNode);

        this.allNodeData[sourceNode] = sourceTree.getNodeData(sourceNode);

        if (parent !== undefined) {
            this.allParents[sourceNode] = parent;
        } else {
            const text = sourceTree.getTextContent(sourceNode);
            if (text) {
                this.allTextContents[sourceNode] = text;
            }
        }
    };

    private getMutableChildren(node: number): number[] {
        let children = this.allChildren[node];
        if (!children) {
            this.allChildren[node] = children = [];
        }
        return children;
    }

    private assertNotTextNode(node: number) {
        if (this.allTextContents[node]) {
            throw new TypeError(`#${node} is a text node`);
        }
    }

    private requireParent(node: number): number {
        const parent = this.allParents[node];
        if (!parent) {
            throw new ReferenceError(`#${node} has no parent`);
        }
        return parent;
    }
}
