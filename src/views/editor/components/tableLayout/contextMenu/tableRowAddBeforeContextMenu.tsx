import { useMainThemeContext } from "@/mainThemeContext";
import { $closeContextMenu } from "@/views/editor/plugins/contextMenuPlugin/common";
import {
  $getExtendedTableNodeFromLexicalNodeOrThrow,
  ExtendedTableNode,
  TableBodyNode,
} from "@editor/nodes/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getTableCellNodeFromLexicalNode,
  $isTableSelection,
  TableCellNode,
} from "@lexical/table";
import {
  $getNodeByKeyOrThrow,
  $getSelection,
  $isRangeSelection,
  $setSelection,
} from "lexical";
import { NumberInputContextMenu } from "./numberInputContextMenu";
import { Submenu, MenuItem } from "@/components/menu";
import SubmenuIcon from "@/components/menu/submenuIcon";

export function TableRowAddBeforeContextMenu() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { RowAddBeforeIcon },
      },
    },
  } = useMainThemeContext();

  const onInputAccepted = (input: HTMLInputElement) => {
    const value = input.valueAsNumber;

    editor.update(
      () => {
        const selection = $getSelection();

        let tableNode: ExtendedTableNode | null = null;
        let cellNode: TableCellNode | null = null;
        if ($isRangeSelection(selection)) {
          cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
          if (!cellNode) throw Error("AddRowBefore: couldn't find node");
          tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
        }

        if ($isTableSelection(selection)) {
          const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(
            selection.tableKey,
          );
          tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
          if (selection.anchor.isBefore(selection.focus)) {
            cellNode = selection.anchor.getNode() as TableCellNode;
          } else {
            cellNode = selection.focus.getNode() as TableCellNode;
          }
        }

        if (!cellNode) throw Error("AddRowBefore: node not found");
        tableNode?.addRowsBefore(cellNode, value);

        $setSelection(null);
        $closeContextMenu(editor);
      },
      { tag: "table-add-row-before" },
    );
  };

  return (
    <Submenu className="">
      <MenuItem>
        <RowAddBeforeIcon />
        <div>Insert Row Before</div>
        <SubmenuIcon />
      </MenuItem>
      <NumberInputContextMenu onInputAccepted={onInputAccepted} />
    </Submenu>
  );
}
