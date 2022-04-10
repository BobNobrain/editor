import { NodeDataSupremum } from '../../document/types';
import { DocumentEditor } from '../types';

export interface PatchCreatorArg {
    /** Target node id */
    nodeId: number;
}

export type PatchCreator<
    A extends PatchCreatorArg = PatchCreatorArg
> = <D extends NodeDataSupremum>(arg: A) => DocumentNodePatch<D>;

export type DocumentNodePatch<D extends NodeDataSupremum> = (doc: DocumentEditor<D>) => DocumentNodePatch<D>;
