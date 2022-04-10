import { DocumentData, DocumentRootNode, NodeDataSupremum } from './types';

export function createEmptyDocument<D extends NodeDataSupremum>(): DocumentData<D> {
    const root: DocumentRootNode = {
        id: 0,
        type: 'root',
        content: [],
    };

    return {
        root,
        nodes: {
            0: root,
        },
        nodeData: {},
    };
}
