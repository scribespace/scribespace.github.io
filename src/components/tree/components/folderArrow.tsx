import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { TreeNode } from '../common';


export function FolderArrow({ node }: { node: TreeNode; }) {
    if (node.isLeaf) return <span></span>;
    const visible = (node.children as TreeNode[]).length > 0;
    return (
        <span style={{ visibility: visible ? 'visible' : 'hidden' }}>
            {node.isOpen ? <SlArrowDown onClick={() => node.isInternal && node.toggle()} /> : <SlArrowRight onClick={() => node.isInternal && node.toggle()} />}
        </span>
    );
}
