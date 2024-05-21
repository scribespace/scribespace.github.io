import { FunctionComponent, useEffect, useRef, useState } from "react";

import useResizeObserver from "use-resize-observer";

import { Node } from "./treeNode";

import { Tree, TreeApi, SimpleTree, CreateHandler, DeleteHandler, MoveHandler, RenameHandler, NodeApi } from 'react-arborist';
import './css/treeView.css'

import { AddIcon, DeleteIcon } from "../global";
import { appGlobals } from "../system/appGlobals";
import { DeleteResults, FileSystemStatus, FileUploadMode, UploadResult } from "../interfaces/system/fs_interface";

const NOTES_PATH = '/notes/'
const TREE_FILE = '/tree'
const TREE_STATUS_FILE = '/tree_status'

class NodeData {
        id: string = "";
        name: string = "";
        children: NodeData[] = [];
}

type Props = {
    setSelectedFile: (file: string) => void;
}

export const TreeView: FunctionComponent<Props> = ({setSelectedFile}) => {
    const [_dataVersion, setDataVersion] = useState<number>(0)
    const [tree, setTree] = useState<SimpleTree<NodeData> | null>(null);
    const { ref: treeParent, height: treeParentHeight = 1 } = useResizeObserver<HTMLDivElement>(); 
    const { ref: controlButtonsRef, height: controlButtonsHeight = 1 } = useResizeObserver<HTMLDivElement>(); 
    const treeElement = useRef<TreeApi<any>>(null);
    const treeOpenNodes = useRef<Set<string>>(new Set<string>());
    const onToggleEnabled = useRef<boolean>(true)

    function UpdateDataVersion() {
        setDataVersion( (prev)=> prev+1);
        UploadTree();
    }

    function UploadTree() {
        const treeJSON = JSON.stringify(tree?.data)
        appGlobals.system?.getFileSystem().uploadFile(TREE_FILE, {content: new Blob([treeJSON])}, FileUploadMode.Replace).then((result) => {
            if (!result) throw Error('UploadTree: no result');
            if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree, status: ' + result.status);
        })
    }

    function UploadTreeStatus() {
        const treeStatusJSON = JSON.stringify([...treeOpenNodes.current])
        appGlobals.system?.getFileSystem().uploadFile(TREE_STATUS_FILE, {content: new Blob([treeStatusJSON])}, FileUploadMode.Replace).then((result) => {
            if (!result) throw Error('UploadTreeStatus: no result');
            if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload tree status, status: ' + result.status);
        })
    }

     const OnAddElement = () => {
        if (treeElement.current == null) return;
        treeElement.current.createInternal();
    }

    const OnDeleteElement = () => {
        if (treeElement.current == null) return;
        const tree = treeElement.current;
        const node = tree.focusedNode;
        if (node) {
          const sib = node.nextSibling;
          const parent = node.parent;
          tree.focus(sib || parent, { scroll: false });
          tree.delete(node);
        }
    }

    const onMove: MoveHandler<NodeData> = (args: {
        dragIds: string[];
        parentId: null | string;
        index: number;
      }) => {
        for (const id of args.dragIds) {
            tree?.move({ id, parentId: args.parentId, index: args.index });
        }
        UpdateDataVersion();
      };
    
      const onRename: RenameHandler<NodeData> = ({ name, id }) => {
        tree?.update({ id, changes: { name } as any });
        UpdateDataVersion();
      };

    const onCreate: CreateHandler<NodeData> = async ({ parentId, index }) => {
        const fileName = 'scribe-space-id-' + crypto.randomUUID() + (new Date().toJSON());

        const result: UploadResult | undefined = await appGlobals.system?.getFileSystem().uploadFile(NOTES_PATH + fileName, {content: new Blob([""])}, FileUploadMode.Add)
        if (!result) throw Error('onCreate note: no result');
        if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload note, status: ' + result.status);
        if (!result.fileInfo) throw Error('onCreate note: No fileInfo');
        if (!result.fileInfo.hash) throw Error('onCreate note: No hash');
        
        if ( result.fileInfo.name ) {
            const id = result.fileInfo.name;
            const node = { id, name: "New File", children: [] } as any;
            tree?.create({ parentId, index, data:node });
            UpdateDataVersion();
            return node;
        }
        return null;
      };

      const onDelete: DeleteHandler<NodeData> = async (args: { ids: string[] }) => {
        if (args.ids.length > 1) throw Error('onDelete: Too many files selected!');
        const id = args.ids[0];

        const result: DeleteResults | undefined = await appGlobals.system?.getFileSystem().deleteFile(id)
        if (!result) throw Error('onDelete note: no result');
        if (result.status !== FileSystemStatus.Success && result.status !== FileSystemStatus.NotFound) throw Error('Couldnt delete note, status: ' + result.status);

        tree?.drop({id})
        UpdateDataVersion();
      };

      const onSelect = (nodes: NodeApi<any>[]) => {
        if (nodes.length > 1) throw Error('onSelect: Too many files selected!');
        if ( nodes.length == 0 ) {
            setSelectedFile('');
        } else {
            setSelectedFile(nodes[0].id);
        }
      }

      const onToggle = (nodeID: string ) => {
        if ( !onToggleEnabled.current ) return 

        if ( treeOpenNodes.current.has(nodeID)) {
            treeOpenNodes.current.delete(nodeID);
        } else {
            treeOpenNodes.current.add(nodeID);
        }
        UploadTreeStatus()
      }

      function DownloadAndSetTreeStatus() {
        appGlobals.system?.getFileSystem().downloadFile(TREE_STATUS_FILE).then((result) => {
            if ( result.status === FileSystemStatus.Success ) {
                result.file?.content?.text().then((treeStatusJSON) => {
                    const treeStatusArray = JSON.parse(treeStatusJSON)
                    onToggleEnabled.current = false
                    for ( const node of treeStatusArray ) {
                        treeOpenNodes.current.add(node);
                        treeElement.current?.close(node);
                    }
                    onToggleEnabled.current = true
                })
            } 
        })
      }

    useEffect(() => {
        appGlobals.system?.getFileSystem().downloadFile(TREE_FILE).then((result) => {
            if ( result.status === FileSystemStatus.Success ) {
                result.file?.content?.text().then((treeJSON) => {
                    setTree( new SimpleTree<NodeData>(JSON.parse(treeJSON)) );
                    DownloadAndSetTreeStatus();
                })
            } else {
                setTree( new SimpleTree<NodeData>([]) );
            }
        })
    }, [])

    return (
        <div style={{height: '100%'}} >
            <div ref={controlButtonsRef}>
                <AddIcon size={"30px"} onClick={tree == null ? ()=>{} : OnAddElement}/> 
                <DeleteIcon size={"30px"} onClick={tree == null ? ()=>{} : OnDeleteElement}/>
            </div>
            <div ref={treeParent} className="tree-div" style={{height: `calc(100% - ${controlButtonsHeight}px)`}}>
                <Tree ref={treeElement} disableEdit={tree == null} data={tree?.data} width={'100%'} height={treeParentHeight} disableMultiSelection={true} 
                onMove={onMove} onRename={onRename} onCreate={onCreate} onDelete={onDelete} onSelect={onSelect} onToggle={onToggle}>
                    {Node}
                </Tree>
            </div>
        </div>
    )
}