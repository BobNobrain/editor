import { PatchCreator, PatchCreatorArg } from './types';

// export interface AddClassArg extends PatchCreatorArg {
//     className: string;
// }
// export const addClass: PatchCreator<AddClassArg> = ({ nodeId, className }) => (doc) => {
//     const node = doc.allNodesById[nodeId];
//     node.classes.add(className);
//     return deleteClass({
//         nodeId,
//         className,
//     });
// };

// export interface DeleteClassArg extends PatchCreatorArg {
//     className: string;
// }
// export const deleteClass: PatchCreator<DeleteClassArg> = ({ nodeId, className }) => (doc) => {
//     const node = doc.allNodesById[nodeId];
//     node.classes.delete(className);
//     return addClass({
//         nodeId,
//         className,
//     });
// };

// export interface ToggleClassArg extends PatchCreatorArg {
//     className: string;
// }
// export const toggleClass: PatchCreator<ToggleClassArg> = ({ nodeId, className }) => (doc) => {
//     const node = doc.allNodesById[nodeId];
//     node.classes.toggle(className);
//     return toggleClass({
//         nodeId,
//         className,
//     });
// };
