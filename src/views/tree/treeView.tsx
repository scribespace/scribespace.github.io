import { useCallback, useEffect, useRef, useState } from "react";

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

import useBoundingRect from "@/hooks/useBoundingRect";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { notesManager } from "@systems/notesManager";
import { TREE_DATA_CHANGED_CMD, treeManager } from "@systems/treeManager";
import { IconBaseProps } from "react-icons";
import {
  TreeNodeApi,
  TreeNodeData,
} from "../../system/treeManager/treeData";
import { NOTES_LOAD_CMD } from "@systems/notesManager/notesCommands";

export default function TreeView() {
  const { treeTheme }: MainTheme = useMainThemeContext();

  const [, setDataVersion] = useState<number>(0);

  const treeParentRef = useRef<HTMLDivElement>(null);
  const controlButtonsRef = useRef<HTMLDivElement>(null);
  const { height: treeParentHeight } = useBoundingRect(treeParentRef);
  const { height: controlButtonsHeight } = useBoundingRect(controlButtonsRef);

  const treeElementRef = useRef<TreeApi<TreeNodeData>>(null);
  const treeOpenNodes = useRef<Set<string>>(new Set<string>());
  const onToggleEnabled = useRef<boolean>(true);

  const updateDataVersion = useCallback( 
    () => {
      setDataVersion((prev) => prev + 1);
    },
    []
  );

  function uploadTreeStatus() {
    treeManager.storeTreeStatus([...treeOpenNodes.current]);
  }

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
    treeManager.moveNodes(args);
  };

  const onRename: RenameHandler<TreeNodeData> = ({ name, id }) => {
    treeManager.renameNode(id, name);
  };

  const onCreate: CreateHandler<TreeNodeData> = async ({ parentId, index }) => {
    const result = await notesManager.createNote();

    if (result.fileInfo!.id) {
      const id = result.fileInfo!.id;
      const node = treeManager.createNode(parentId, index, id, result.fileInfo!.path);
      return node;
    }
    return null;
  };

  const onDelete: DeleteHandler<TreeNodeData> = async (args: {
    ids: string[];
  }) => {
    if (args.ids.length > 1) throw Error("onDelete: Too many files selected!");
    const id = args.ids[0];

    await treeManager.deleteNode(id);
  };

  const onSelect = (nodes: TreeNodeApi[]) => {
    if (nodes.length > 1) throw Error("onSelect: Too many files selected!");
    if (nodes.length > 0) {
      $callCommand(NOTES_LOAD_CMD, nodes[0].id);
    }
  };

  const onToggle = (nodeID: string) => {
    if (!onToggleEnabled.current) return;

    if (treeOpenNodes.current.has(nodeID)) {
      treeOpenNodes.current.delete(nodeID);
    } else {
      treeOpenNodes.current.add(nodeID);
    }
    uploadTreeStatus();
  };

  useEffect(() => {
      const treeStatusArray = treeManager.getTreeStatus();
      onToggleEnabled.current = false;
      for (const node of treeStatusArray) {
        treeOpenNodes.current.add(node);
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
            onClick={treeManager.isTreeReady() ? OnAddElement : () => {}}
          />
          <DeleteIcon
            size={"30px"}
            onClick={treeManager.isTreeReady() ? OnDeleteElement : () => {}}
          />
        </div>
        <div
          ref={treeParentRef}
          style={{ height: `calc(100% - ${controlButtonsHeight}px)`, overflow: 'visible' }}
        >
          <Tree
            ref={treeElementRef}
            disableEdit={!treeManager.isTreeReady()}
            data={treeManager.data}
            width={"100%"}
            height={treeParentHeight}
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
