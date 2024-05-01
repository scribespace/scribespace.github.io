import { useRef } from "react";

import useResizeObserver from "use-resize-observer";

import { Node } from "./treeNode";

import { Tree, TreeApi } from 'react-arborist';
import './css/treeView.css'

import { AddIcon, DeleteIcon } from "../global";

class NodeData {
        id: string = "";
        name: string = "";
        children: NodeData[] = [];
}

const data: NodeData[] = [];

export function TreeView() {
    const { ref, height = 1 } = useResizeObserver<HTMLDivElement>(); 
    const treeElement = useRef<TreeApi<any>>(null);

    const OnAddElement = () => {
        if (treeElement.current == null) return;
        treeElement.current.createInternal();
    }

    const OnDeleteElement = () => {
        if (treeElement.current == null) return;
        let tree = treeElement.current;
        const node = tree.focusedNode;
        if (node) {
          const sib = node.nextSibling;
          const parent = node.parent;
          tree.focus(sib || parent, { scroll: false });
          tree.delete(node);
        }
    }

    return (
        <div ref={ref} style={{height: '100%'}} >
            <AddIcon size={"30px"} onClick={OnAddElement}/> 
            <DeleteIcon size={"30px"} onClick={OnDeleteElement}/>
            <Tree ref={treeElement} initialData={data} width={'100%'} height={height} disableMultiSelection={true}>
                {Node}
            </Tree>
        </div>
    )
}