export function createEditorNode(): HTMLDivElement {
    const node = document.createElement('div');
    node.setAttribute('contenteditable', 'true');
    return node;
}
