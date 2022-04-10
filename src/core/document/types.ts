export interface DocumentTree {
    root: DocumentNode;
    nodes: Record<number, DocumentNode>;
}

export interface DocumentData<Decl extends NodeDataSupremum> extends DocumentTree {
    nodeData: DocumentNodeDataRegistries<Decl>;
}

export interface DocumentNode {
    readonly id: number;
    readonly type: string;
    readonly content: string | ChildNodeIdsList;
}
export interface MutableDocumentNode extends DocumentNode {
    content: string | number[];
}

export interface ChildNodeIdsList extends Iterable<number> {
    readonly [key: number]: number;
    readonly length: number;
}

export interface DocumentRootNode extends DocumentNode {
    readonly id: 0;
    readonly type: 'root';
}

export type NodeDataSupremum = Record<string, unknown>;

export interface DocumentNodeDataRegistry<NodeData> {
    [nodeId: number]: NodeData;
}
export type DocumentNodeDataRegistries<Decl extends NodeDataSupremum> = {
    [nodeType in keyof Decl]?: DocumentNodeDataRegistry<Decl[nodeType]>;
};
