import { enrichRange } from '../../selection/enrich';
import { DocumentTreeRange, DocumentTreeRangeRichInfo } from '../../selection/types';
import { DocumentTree } from '../types';
import { walk } from '../walk';

export interface GetSelectionTextPayload {
    tree: DocumentTree<any>;
    selection: DocumentTreeRange;
}

export interface GetSelectionTextResult {
    fragments: SelectionTextFragment[];
    selectionInfo: DocumentTreeRangeRichInfo;
}

export interface SelectionTextFragment {
    node: number;
    sourceText: string;
    text: string;
}

export function getSelectionText({
    tree,
    selection,
}: GetSelectionTextPayload): GetSelectionTextResult {
    const selectionInfo = enrichRange(tree, selection);

    if (selection.start.node === selection.end.node) {
        // shortcut for the case where the only node is selected
        const sourceText = tree.getTextContent(selection.start.node);
        return {
            fragments: [{
                node: selection.start.node,
                sourceText,
                text: sourceText.substring(selectionInfo.first.textPosition, selectionInfo.last.textPosition),
            }],
            selectionInfo,
        };
    }

    const fragments: SelectionTextFragment[] = [];

    walk({
        tree,
        startNode: selectionInfo.first.node,
        cb(node, ctx) {
            if (tree.isLeaf(node)) {
                const text = tree.getTextContent(node);
                fragments.push({
                    node,
                    sourceText: text,
                    text,
                });
            }

            if (node === selectionInfo.last.node) {
                ctx.stop();
            }
        }
    });

    if (selectionInfo.first.textPosition > 0) {
        fragments[0].text = fragments[0].text.substring(selectionInfo.first.textPosition);
    }

    const lastFragment = fragments[fragments.length - 1];
    if (selectionInfo.last.textPosition < lastFragment.sourceText.length) {
        lastFragment.text = lastFragment.text.substring(0, selectionInfo.last.textPosition);
    }

    return {
        fragments,
        selectionInfo,
    };
}

export function joinSelectionFragments(fragments: SelectionTextFragment[]): string {
    return fragments.map(({ text }) => text).join('');
}
