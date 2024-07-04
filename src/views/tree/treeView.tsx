import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import TreeNode from "./components/treeNode";

import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
  Tree,
  TreeApi
} from "react-arborist";
import "./css/treeView.css";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { $getTreeNodeIDFromURL, $setURLTreeNodeID, $setWindowTitle } from "@systems/environment/environment";
import { $getTreeManager, TREE_DATA_CHANGED_CMD, TREE_PROCESS_START_NOTE_CMD, TREE_SELECT_NOTE_CMD, TreeSelectPayload, TreeSelectionSrc } from "@systems/treeManager";
import { IconBaseProps } from "react-icons";
import {
  TreeNodeApi,
  TreeNodeData,
} from "../../system/treeManager/treeData";
import { bundleFunctions } from "@utils";
import { BLOCK_EDITING_CMD } from "@systems/systemCommands";

export default function TreeView() {
  const { treeTheme }: MainTheme = useMainThemeContext();

  const [, setDataVersion] = useState<number>(0);

  const [treeParentElement, setTreeParentElement] = useState<HTMLDivElement | null>(null);
  const controlButtonsRef = useRef<HTMLDivElement>(null);
  const [ treeParentRect, setTreeParentRect ] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));
  const [ controlButtonsRect, setControlButtonsRect ] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

  const treeElementRef = useRef<TreeApi<TreeNodeData>>(null);
  const onToggleEnabled = useRef<boolean>(true);
  const lastSelectionRef = useRef<string>('');
  const selectionSrcRef = useRef<'unknown' | TreeSelectionSrc>('unknown');

  const updateDataVersion = useCallback( 
    () => {
      setDataVersion((prev) => prev + 1);
    },
    []
  );

  const OnAddElement = () => {
    if (treeElementRef.current == null) return;
    treeElementRef.current.createInternal();
  };

  const OnDeleteElement = () => {
    if (treeElementRef.current == null) return;
    const treeElement = treeElementRef.current;
    const node = treeElement.focusedNode;
    if (node) {
      const sib = node.nextSibling;
      const parent = node.parent;
      treeElement.focus(sib || parent, { scroll: false });
      treeElement.delete(node);
    }
  };

  const onMove: MoveHandler<TreeNodeData> = (args: {
    dragIds: string[];
    parentId: null | string;
    index: number;
  }) => {
    $getTreeManager().moveNodes(args);
  };

  const onRename: RenameHandler<TreeNodeData> = ({ name, id }) => {
    $getTreeManager().renameNode(id, name);
  };

  const onCreate: CreateHandler<TreeNodeData> = async ({ parentId, index }) => {
    return $getTreeManager().createNode(parentId, index);
  };

  const onDelete: DeleteHandler<TreeNodeData> = (args: {
    ids: string[], nodes: TreeNodeApi[]
  }) => {
    if (args.ids.length > 1) throw Error("onDelete: Too many files selected!");
    const id = args.ids[0];
    $getTreeManager().deleteNode( id );
  };

  const onSelect = (nodes: TreeNodeApi[]) => {
    if (nodes.length > 1) throw Error("onSelect: Too many files selected!");
    if (nodes.length > 0) {
      const node = nodes[0];
      if ( lastSelectionRef.current !== node.data.id ) {
        $setWindowTitle(node.data.name);
        if ( selectionSrcRef.current !== 'history' && selectionSrcRef.current !== 'pageload' ) {
          $setURLTreeNodeID(node.data.id);
        }
        
        lastSelectionRef.current = node.data.id;
        selectionSrcRef.current = 'unknown';
        $getTreeManager().selectTreeNode(nodes[0].id);
      }
    }
  };

  const onToggle = (nodeID: string) => {
    if ( onToggleEnabled.current )
      $getTreeManager().toggleTreeNode(nodeID);
  };

  useEffect(() => {
    onToggleEnabled.current = false;
    const closedTreeNodes = $getTreeManager().getClosedNodes();
    for (const node of closedTreeNodes) {
      treeElementRef.current?.close(node);
    }
    onToggleEnabled.current = true;
  }, []);

  useEffect(
    () => {
      return $registerCommandListener( 
        TREE_DATA_CHANGED_CMD, 
        () => {
          updateDataVersion();
        }
      );
    },
    [updateDataVersion]
  );

  const updateSize = useCallback(
    () => {
      if (treeParentElement){ 
        setTreeParentRect( treeParentElement.getBoundingClientRect() );
      }

      if (controlButtonsRef.current)
        setControlButtonsRect( controlButtonsRef.current.getBoundingClientRect() );
    },
    [treeParentElement]
  );

  const callSelection = useCallback(
    (selectPayload: TreeSelectPayload) => {
      selectionSrcRef.current = selectPayload.commandSrc;
      treeElementRef.current?.select(selectPayload.treeNodeID);
    },
    []
  );

  useEffect(
    () => {
      return $registerCommandListener(
        TREE_SELECT_NOTE_CMD,
        (selectPayload) => {
          callSelection(selectPayload);
        }
      );
    },
    [callSelection]
  );

  useEffect(
    () => {
      return bundleFunctions(
         $registerCommandListener(
            TREE_PROCESS_START_NOTE_CMD,
            () => {
              const loadTreeNodeID = $getTreeNodeIDFromURL();
              if ( loadTreeNodeID !== '' ) {
                callSelection({treeNodeID: loadTreeNodeID, commandSrc: 'pageload'});
              }
            }
          ),
          $registerCommandListener(
            BLOCK_EDITING_CMD,
            () => {

            }
          )
        );
      
    },
    [callSelection]
  );

  useLayoutEffect( 
    () => {
      updateSize();
    },
    [updateSize]
  );

  function AddIcon(props: IconBaseProps) {
    return treeTheme.AddIcon(props);
  }

  function DeleteIcon(props: IconBaseProps) {
    return treeTheme.DeleteIcon(props);
  }
  return (
    <div id="tree-view" className="tree-view">
      <div style={{ height: "100%" }}> 
        <div ref={controlButtonsRef}>
          <AddIcon
            size={"30px"}
            onClick={$getTreeManager().isTreeReady() ? OnAddElement : () => {}}
          />
          <DeleteIcon
            size={"30px"}
            onClick={$getTreeManager().isTreeReady() ? OnDeleteElement : () => {}}
          />
        </div>
        <div ref={setTreeParentElement} style={{ height: `calc(100% - ${controlButtonsRect.height}px)`, overflow: 'visible' }} onResize={updateSize}>
          <Tree
            ref={treeElementRef}
            disableEdit={true}
            data={$getTreeManager().data}
            width={"100%"}
            height={treeParentRect.height}
            disableMultiSelection={true}
            onMove={onMove}
            onRename={onRename}
            onCreate={onCreate}
            onDelete={onDelete}
            onSelect={onSelect}
            onToggle={onToggle}
          >
            {TreeNode}
          </Tree>
        </div>
      </div>
    </div>
  );
}

