import { Maybe } from '../../util/Maybe';
import type { DocumentNode } from './types';

export interface TraversalController<T> {
    resolve(result: T): void;
    doNotVisitChildren(): void;
}
interface TraversalControllerImpl<T> extends TraversalController<T> {
    result: Maybe<T>;
    shouldVisitChildren: boolean;
}

export type TraverseCallback<T> = (
    node: DocumentNode,
    controller: TraversalController<T>,
) => void;

export function traverse<T>(
    node: DocumentNode,
    registry: Record<number, DocumentNode>,
    cb: TraverseCallback<T>,
): Maybe<T> {
    const controller: TraversalControllerImpl<T> = {
        result: Maybe.nothing,
        shouldVisitChildren: true,
        doNotVisitChildren: () => {
            controller.shouldVisitChildren = false;
        },
        resolve: (value) => {
            controller.result = { value };
        },
    };

    traverseImpl(node, registry, cb, controller);

    return controller.result;
}
function traverseImpl<T>(
    node: DocumentNode,
    registry: Record<number, DocumentNode>,
    cb: TraverseCallback<T>,
    controller: TraversalControllerImpl<T>,
): void {
    cb(node, controller);

    if (controller.result || !controller.shouldVisitChildren || typeof node.content === 'string') {
        return;
    }

    for (const childId of node.content) {
        traverseImpl(registry[childId], registry, cb, controller);
        if (controller.result) {
            return;
        }
        // resetting this property for next node
        controller.shouldVisitChildren = true;
    }
}
