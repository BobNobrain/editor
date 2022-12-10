import { InputType, isFormattingInputType, isHistoryInputType } from './input';

export function createEditorNode(): HTMLDivElement {
    const node = document.createElement('div');
    node.setAttribute('contenteditable', 'true');

    // blocking all native input methods that we will reimplement ourselves
    node.addEventListener('beforeinput', (ev) => {
        if (isHistoryInputType(ev.inputType) ||
            isFormattingInputType(ev.inputType)
        ) {
            ev.preventDefault();
            return;
        }

        switch (ev.inputType) {
            case InputType.InsertHorizontalRule:
            case InputType.InsertOrderedList:
            case InputType.InsertUnorderedList:
                ev.preventDefault();
                return;
        }
    });

    return node;
}
