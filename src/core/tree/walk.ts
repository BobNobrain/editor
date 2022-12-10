import { DocumentTree } from './types';

export interface WalkPayload<D> {
    tree: DocumentTree<D>;
    startNode?: number;
    cb: (node: number, controller: WalkController<D>) => void;
}

export interface WalkController<D> {
    readonly tree: DocumentTree<D>;
    stop(): void;
}

export function walk<D>({
    tree,
    startNode = tree.root,
    cb,
}: WalkPayload<D>) {
    let cursor: number | undefined = startNode;
    const visited: Record<number, number[]> = {};

    const controller: WalkController<D> = {
        tree,
        stop() {
            cursor = undefined;
        }
    };

    while (true) {
        if (cursor === undefined) {
            return;
        }

        if (visited[cursor]) {
            const next = visited[cursor].pop();
            if (next !== undefined) {
                cursor = next;
                continue;
            }

            // no children left, go to parent
            cursor = tree.getParentOf(cursor);
            continue;
        }

        cb(cursor, controller);
        if (cursor === undefined) {
            return;
        }

        const children = tree.getChildrenOf(cursor);
        if (children.length) {
            let unvisitedChildren: number[] | undefined;
            for (let i = children.length - 1; i >= 0; i--) {
                if (visited[children[i]]) {
                    unvisitedChildren = children.slice(i + 1);
                    break;
                }
            }
            if (!unvisitedChildren) {
                unvisitedChildren = children.slice();
            }

            if (unvisitedChildren.length) {
                unvisitedChildren.reverse();

                visited[cursor] = unvisitedChildren;
                cursor = unvisitedChildren.pop();
                continue;
            }
        }

        visited[cursor] = [];
        // this is a leaf, we should go up
        cursor = tree.getParentOf(cursor);
    }
}
