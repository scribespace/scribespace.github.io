import { NodeRendererProps } from "react-arborist";

import { AiOutlineEdit } from "react-icons/ai";
import { SlDoc } from "react-icons/sl";
import clsx from "clsx";

import "./css/treeNode.css";
import { TreeNodeData } from "../../../system/treeManager/treeData";
import { FolderArrow } from "./folderArrow";
import { Input } from "./input";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { IconBaseProps } from "react-icons";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { TREE_SELECT_NOTE_CMD } from "@systems/treeManager";
import { useCallback } from "react";
import { $openTab } from "@systems/environment/environment";

export default function TreeNode({
  node,
  style,
  dragHandle,
}: NodeRendererProps<TreeNodeData>) {
  const { treeTheme }: MainTheme = useMainThemeContext();

  const OnEditNode = () => {
    if (!node.tree.props.onRename) return;
    node.tree.edit(node);
  };

  const OnAddInternal = (event: React.MouseEvent) => {
    if (node.isInternal) {
      node.open();
      node.tree.create({type:'internal', parentId: node.id});

      event.preventDefault();
      event.stopPropagation();
    }
  };

  const OnDeleteNode = (event: React.MouseEvent) => {
    if (!node.tree.props.onDelete) return;
    const sib = node.nextSibling;
    const parent = node.parent;
    node.tree.focus(sib || parent, { scroll: false });
    node.tree.delete(node);

    event.preventDefault();
    event.stopPropagation();
  };

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if ( event.ctrlKey || event.metaKey ) {
        $openTab(`${window.location.origin}/${node.data.id}`);
        event.stopPropagation(); 
        event.preventDefault();
        return;
      }

      $callCommand(TREE_SELECT_NOTE_CMD, {treeNodeID: node.data.id, commandSrc: 'user'}); 
      event.stopPropagation(); 
      event.preventDefault();
    },
    [node.data.id]
  );

  function AddIcon(props: IconBaseProps) {
    return treeTheme.AddIcon(props);
  }

  function DeleteIcon(props: IconBaseProps) {
    return treeTheme.DeleteIcon(props);
  }

  return (
    <div ref={dragHandle} style={style} className={clsx("node", node.state)} onClick={onClick}>
      <FolderArrow node={node} />
      <span>
        <SlDoc />
      </span>
      <span>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
      <AiOutlineEdit className="nodeControl" onClick={OnEditNode} />
      <AddIcon className="nodeControl" onClick={OnAddInternal} />
      <DeleteIcon className="nodeControl" onClick={OnDeleteNode} />
    </div>
  );
}
