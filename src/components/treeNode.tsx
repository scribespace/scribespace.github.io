  
import { NodeApi, NodeRendererProps } from 'react-arborist';

import { SlDoc, SlArrowDown, SlArrowRight } from "react-icons/sl";
import { AddIcon, DeleteIcon } from "../global";
import clsx from "clsx";

import './css/treeNode.css'

  
export function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
    /* This node instance can do many things. See the API reference. */

    const OnAddInternal = () => {
        if ( node.isInternal ) {
            node.select(); 
            node.open();
            node.tree.createInternal()
        } 
    }

    const OnDeleteNode = () => {
        if (!node.tree.props.onDelete) return; 
        const sib = node.nextSibling;
        const parent = node.parent;
        node.tree.focus(sib || parent, { scroll: false });
        node.tree.delete(node); 
    }

    return (
        <div
        ref={dragHandle}
        style={style}
        className={clsx('node', node.state)}            
        >
        <FolderArrow node={node} />
        <span>            
            <SlDoc/>
        </span>
        <span>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
        <span>{node.data.unread === 0 ? null : node.data.unread}</span>
        <AddIcon className='nodeControl' onClick={OnAddInternal}/>
        <DeleteIcon className='nodeControl' onClick={OnDeleteNode}/>
        </div>
    );
    }

    function FolderArrow({ node } : {node: NodeApi<any>}) {
    if (node.isLeaf) return <span></span>;
    return (
        <span>
        {node.isOpen ? <SlArrowDown onClick={() => node.isInternal && node.toggle()}/> : <SlArrowRight onClick={() => node.isInternal && node.toggle()}/>}
        </span>
    );
    }

    function Input({ node }: { node: NodeApi<any> }) {
    return (
        <input
        autoFocus
        type="text"
        defaultValue={node.data.name}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => node.reset()}
        onKeyDown={(e) => {
            if (e.key === "Escape") node.reset();
            if (e.key === "Enter") node.submit(e.currentTarget.value);
        }}
        />
    );
    }