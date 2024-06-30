  
import { NodeApi, NodeRendererProps } from 'react-arborist';

import { AiOutlineEdit } from "react-icons/ai";
import { SlDoc, SlArrowDown, SlArrowRight } from "react-icons/sl";
import { AddIcon, DeleteIcon } from "../global";
import clsx from "clsx";

import './css/treeNode.css'

  
export function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
    /* This node instance can do many things. See the API reference. */

    const OnEditNode = () => {
        if (!node.tree.props.onRename) return; 
        node.tree.edit(node); 
    }

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
        <AiOutlineEdit className='nodeControl' onClick={OnEditNode}/>
        <AddIcon className='nodeControl' onClick={OnAddInternal}/>
        <DeleteIcon className='nodeControl' onClick={OnDeleteNode}/>
        </div>
    );
    }

    function FolderArrow({ node } : {node: NodeApi<any>}) {
    if (node.isLeaf) return <span></span>;
    const visible = (node.children as NodeApi<any>[]).length > 0
    return (
        <span style={{visibility: visible ? 'visible' : 'hidden'}}>
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