import { useEffect, useRef, useState } from "react";

import TreeNode from "./components/treeNode";

import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
  SimpleTree,
  Tree,
  TreeApi,
} from "react-arborist";
import "./css/treeView.css";

import useBoundingRect from "@/hooks/useBoundingRect";
import {
  DownloadResult,
  FileSystemStatus,
  FileUploadMode,
  UploadResult
} from "@/interfaces/system/fileSystem/fileSystemShared";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { IconBaseProps } from "react-icons";
import {
  NOTES_PATH,
  TREE_FILE,
  TREE_STATUS_FILE,
  TreeNodeApi,
  TreeNodeData,
} from "./common";
import { $getFileSystem } from "@coreSystems";

interface TreeViewProps {
  setSelectedFile: (file: string) => void;
}

export default function TreeView({ setSelectedFile }: TreeViewProps) {
  const { treeTheme }: MainTheme = useMainThemeContext();

  const [, setDataVersion] = useState<number>(0);
  const [tree, setTree] = useState<SimpleTree<TreeNodeData> | null>(null);

  const treeParentRef = useRef<HTMLDivElement>(null);
  const controlButtonsRef = useRef<HTMLDivElement>(null);
  const { height: treeParentHeight } = useBoundingRect(treeParentRef);
  const { height: controlButtonsHeight } = useBoundingRect(controlButtonsRef);

  const treeElement = useRef<TreeApi<TreeNodeData>>(null);
  const treeOpenNodes = useRef<Set<string>>(new Set<string>());
  const onToggleEnabled = useRef<boolean>(true);

  function updateDataVersion() {
    setDataVersion((prev) => prev + 1);
    uploadTree();
  }

  function uploadTree() {
    const treeJSON = JSON.stringify(tree?.data);
    const treeBlob = new Blob([treeJSON]);
    $getFileSystem().uploadFileAsync( TREE_FILE, { content: treeBlob }, FileUploadMode.Replace );
  }

  function uploadTreeStatus() {
    const treeStatusJSON = JSON.stringify([...treeOpenNodes.current]);
    $getFileSystem().uploadFileAsync( TREE_STATUS_FILE, { content: new Blob([treeStatusJSON]) }, FileUploadMode.Replace );
  }

  const OnAddElement = () => {
    if (treeElement.current == null) return;
    treeElement.current.createInternal();
  };

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
  };

  const onMove: MoveHandler<TreeNodeData> = (args: {
    dragIds: string[];
    parentId: null | string;
    index: number;
  }) => {
    for (const id of args.dragIds) {
      tree?.move({ id, parentId: args.parentId, index: args.index });
    }
    updateDataVersion();
  };

  const onRename: RenameHandler<TreeNodeData> = ({ name, id }) => {
    tree?.update({ id, changes: { name } as TreeNodeData });
    updateDataVersion();
  };

  const onCreate: CreateHandler<TreeNodeData> = async ({ parentId, index }) => {
    const fileName =
      "scribe-space-id-" + crypto.randomUUID() + new Date().toJSON();

    const result: UploadResult | undefined = await $getFileSystem().uploadFile(
      NOTES_PATH + fileName,
      { content: new Blob([""]) },
      FileUploadMode.Add
    );
    if (!result) throw Error("onCreate note: no result");
    if (result.status !== FileSystemStatus.Success)
      throw Error("Couldnt upload note, status: " + result.status);
    if (!result.fileInfo) throw Error("onCreate note: No fileInfo");
    if (!result.fileInfo.hash) throw Error("onCreate note: No hash");

    if (result.fileInfo.name) {
      const id = result.fileInfo.name;
      const node = { id, name: "New File", children: [] } as TreeNodeData;
      tree?.create({ parentId, index, data: node });
      updateDataVersion();
      return node;
    }
    return null;
  };

  const onDelete: DeleteHandler<TreeNodeData> = async (args: {
    ids: string[];
  }) => {
    if (args.ids.length > 1) throw Error("onDelete: Too many files selected!");
    const id = args.ids[0];

    await $getFileSystem().deleteFileAsync(id)
    .then(() => {
      tree?.drop({ id });
      updateDataVersion();
    });
  };

  const onSelect = (nodes: TreeNodeApi[]) => {
    if (nodes.length > 1) throw Error("onSelect: Too many files selected!");
    if (nodes.length == 0) {
      setSelectedFile("");
    } else {
      setSelectedFile(nodes[0].id);
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

  function downloadAndSetTreeStatus() {
    $getFileSystem().downloadFileAsync(TREE_STATUS_FILE)
    .then((result: DownloadResult) => {
      if (result.status === FileSystemStatus.Success) {
        result.file?.content?.text().then((treeStatusJSON) => {
          const treeStatusArray = JSON.parse(treeStatusJSON);
          onToggleEnabled.current = false;
          for (const node of treeStatusArray) {
            treeOpenNodes.current.add(node);
            treeElement.current?.close(node);
          }
          onToggleEnabled.current = true;
        });
      }
    });
  }

  useEffect(() => {
    $getFileSystem().downloadFileAsync(TREE_FILE)
    .then((result: DownloadResult) => {
      if (result.status === FileSystemStatus.Success) {
        result.file?.content?.text().then((treeJSON) => {
          setTree(new SimpleTree<TreeNodeData>(JSON.parse(treeJSON)));
          downloadAndSetTreeStatus();
        });
      } else {
        setTree(new SimpleTree<TreeNodeData>([]));
      }
    });
  }, []);

  function AddIcon(props: IconBaseProps) {
    return treeTheme.AddIcon(props);
  }

  function DeleteIcon(props: IconBaseProps) {
    return treeTheme.DeleteIcon(props);
  }

  return (
    <div style={{ height: "100%" }}>
      <div ref={controlButtonsRef}>
        <AddIcon
          size={"30px"}
          onClick={tree == null ? () => {} : OnAddElement}
        />
        <DeleteIcon
          size={"30px"}
          onClick={tree == null ? () => {} : OnDeleteElement}
        />
      </div>
      <div
        ref={treeParentRef}
        className="tree-div"
        style={{ height: `calc(100% - ${controlButtonsHeight}px)` }}
      >
        <Tree
          ref={treeElement}
          disableEdit={tree == null}
          data={tree?.data}
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
  );
}
