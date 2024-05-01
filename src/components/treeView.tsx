import useResizeObserver from "use-resize-observer";

import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import './css/treeView.css'

import { SlDoc, SlArrowDown, SlArrowRight } from "react-icons/sl";
import { AiOutlineFileAdd, AiOutlineDelete } from "react-icons/ai";
import clsx from "clsx";

  const data = [
    { id: "1", name: "Unread" },
    { id: "2", name: "Threads" },
    {
      id: "3",
      name: "Chat Rooms",
      children: [
        { id: "c1", name: "General" },
        { id: "c2", name: "Random" },
        { id: "c3", name: "Open Source Projects" },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      children: [
        { id: "d1", name: "Alice" },
        { id: "d2", name: "Bob" },
        { id: "d3", name: "Charlie" },
      ],
    },
  ];

export function TreeView() {
    const { ref, height = 1 } = useResizeObserver<HTMLDivElement>();
  
    function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
        /* This node instance can do many things. See the API reference. */

        const OnAddInternal = () => {
            if ( node.isInternal ) {
                node.select(); 
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
            <AiOutlineFileAdd style={{marginLeft: "10px"}} onClick={OnAddInternal}/>
            <AiOutlineDelete style={{marginLeft: "10px"}} onClick={OnDeleteNode}/>
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

    return (
        <div ref={ref} style={{height: '100%'}} >
            <Tree initialData={data} width={'100%'} height={height} disableMultiSelection={true}>
                {Node}
            </Tree>
        </div>
    )
}