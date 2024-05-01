import FolderTree, { IconComponents, NodeData, testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import './css/treeView.css'

export function TreeView() {
    const AddFileIcon = (..._args: any[]) => null;
    const iconComponents = {
      AddFileIcon
    } as IconComponents;
    const onTreeStateChange = (state: NodeData, event: unknown) => console.log(state, event);

    return (<FolderTree data={ testData } showCheckbox={ false } iconComponents={iconComponents} onChange={onTreeStateChange}/>)
}