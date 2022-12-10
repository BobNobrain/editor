import { createHistory } from './history';
import type { MutableDocumentHistory } from './types';

export const createDocumentHistory: <Data>(limit: number) => MutableDocumentHistory<Data> = createHistory;
export { createHistory };

export type {
    MutableBasicHistory,
    DocumentHistory,
    MutableDocumentHistory,
} from './types';

