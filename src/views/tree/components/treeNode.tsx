  
import { NodeRendererProps } from 'react-arborist';

import { AiOutlineEdit } from "react-icons/ai";
import { SlDoc } from "react-icons/sl";
import { AddIcon, DeleteIcon } from "../../../global";
import clsx from "clsx";

import './css/treeNode.css';
import { NodeData } from '../common';
import { FolderArrow } from './folderArrow';
import { Input } from './input';

  
export function Node({ node, style, dragHandle }: NodeRendererProps<NodeData>) {
    /* This node instance can do many things. See the API reference. */

    const OnEditNode = () => {
        if (!node.tree.props.onRename) return; 
        node.tree.edit(node); 
    };

    const OnAddInternal = () => {
        if ( node.isInternal ) {
            node.select(); 
            node.open();
            node.tree.createInternal();
        } 
    };

    const OnDeleteNode = () => {
        if (!node.tree.props.onDelete) return; 
        const sib = node.nextSibling;
        const parent = node.parent;
        node.tree.focus(sib || parent, { scroll: false });
        node.tree.delete(node); 
    };

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
        <AiOutlineEdit className='nodeControl' onClick={OnEditNode}/>
        <AddIcon className='nodeControl' onClick={OnAddInternal}/>
        <DeleteIcon className='nodeControl' onClick={OnDeleteNode}/>
        </div>
    );
    }

