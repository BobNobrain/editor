// @ts-check
import { createEditorNode } from '../src/dom';

const main = document.getElementById('main');
const editorNode = createEditorNode();
main.appendChild(editorNode);

// @ts-ignore
window.editor = editorNode;

// editorNode.addEventListener('input', (ev) => {
//     /** @type {InputEvent} */
//     // @ts-ignore
//     const iev = ev;
// });

// editorNode.addEventListener('beforeinput', (ev) => {
//     /** @type {InputEvent} */
//     // @ts-ignore
//     const iev = ev;
//     console.log(iev.target);
//     console.log(iev.inputType, iev.data, /*iev.getTargetRanges()*/);

//     // for (const range of iev.getTargetRanges()) {
//     // }
// });
