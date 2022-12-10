import { DocumentTree } from './types';

export interface TraversalController {
    readonly tree: DocumentTree<any>;
    stop(): void;
    skipSubtree(): void;
}
interface TraversalControllerImpl<T> extends TraversalController {
    result: T;
    shouldVisitChildren: boolean;
    shouldHalt: boolean;
}

export type TraverseCallback<Result> = (
    result: Result,
    node: number,
    controller: TraversalController,
) => Result;

export function traverse<Result>(
    tree: DocumentTree<any>,
    cb: TraverseCallback<Result>,
    initialValue: Result,
    startNode = tree.root,
): Result {
    const controller: TraversalControllerImpl<Result> = {
        tree,
        result: initialValue,
        shouldVisitChildren: true,
        shouldHalt: false,
        skipSubtree: () => {
            controller.shouldVisitChildren = false;
        },
        stop: () => {
            controller.shouldHalt = true;
        },
    };

    traverseImpl(tree, startNode, cb, controller);

    return controller.result;
}

function traverseImpl<R>(
    tree: DocumentTree<any>,
    node: number,
    cb: TraverseCallback<R>,
    controller: TraversalControllerImpl<R>,
): void {
    controller.result = cb(controller.result, node, controller);

    if (controller.shouldHalt || !controller.shouldVisitChildren) {
        return;
    }

    const children = tree.getChildrenOf(node);
    for (const child of children) {
        traverseImpl(tree, child, cb, controller);
        if (controller.shouldHalt) {
            return;
        }
        // resetting this property for next node
        controller.shouldVisitChildren = true;
    }
}

export function traverseVoid(
    tree: DocumentTree<any>,
    cb: (node: number, controller: TraversalController) => void,
    startNode?: number,
): void {
    traverse<void>(tree, (_, node, controller) => cb(node, controller), undefined, startNode);
}
