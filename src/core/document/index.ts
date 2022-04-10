export type {
    DocumentData,
    DocumentNode,
    DocumentRootNode,
    DocumentTree,
    MutableDocumentNode,
    NodeDataSupremum,
    DocumentNodeDataRegistry,
    DocumentNodeDataRegistries,
} from './types';

export { copySubtree } from './copySubtree';
export type { CopySubtreeOptions } from './copySubtree';
export { createEmptyDocument } from './create';
export { removeSubtree } from './removeSubtree';
export { traverse } from './traverse';
export type { TraversalController, TraverseCallback } from './traverse';
export { cloneNodeObject, getAllParents, getDeepestCommonRoot } from './utils';
