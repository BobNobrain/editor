import type { HumanString } from '../../util/HumanString';
import type { DocumentAction } from './types';

export function combineActions<Data>(
    name: HumanString,
    actions: DocumentAction<Data>[],
): DocumentAction<Data> {
    return {
        name,

        apply(doc) {
            let i = 0;
            try {
                for (; i < actions.length; i++) {
                    actions[i].apply(doc);
                }
            } catch (err) {
                for (; i >= 0; i--) {
                    actions[i].undo(doc);
                }

                throw err;
            }
        },

        undo(doc) {
            let i = actions.length - 1;
            try {
                for (; i >= 0; i--) {
                    actions[i].undo(doc);
                }
            } catch (err) {
                for (; i < actions.length; i++) {
                    actions[i].apply(doc);
                }

                throw err;
            }
        },
    };
}
