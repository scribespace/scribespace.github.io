import { $getExtendedTableNodeFromLexicalNodeOrThrow, ExtendedTableNode, TableBodyNode } from "@editor/nodes/table";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";
import { $getTableColumnIndexFromTableCellNode } from "@editor/plugins/tablePlugin/utils";
import {
    $getTableCellNodeFromLexicalNode, $getTableNodeFromLexicalNodeOrThrow, $isTableCellNode, $isTableSelection,
    TableCellNode
} from "@lexical/table";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { $getNodeByKeyOrThrow, $getSelection, $isRangeSelection } from "lexical";
import { useMemo } from "react";
import { MenuItem, Submenu } from "../../menu";
import SubmenuIcon from "../../menu/submenuIcon";
import { TableContextMenuOptionProps } from "./tableContextMenuCommon";
import TableNumberInputContextMenu from "./tableNumberInputContextMenu";


export default function TableAddColumnBeforeContextMenu({ editor }: TableContextMenuOptionProps) {
    const menuContext = useContextMenuContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const AddColumnBeforeIcon = useMemo(()=>{
        return editorTheme.tableTheme.menuTheme.AddColumnBeforeIcon;
    },[editorTheme.tableTheme.menuTheme.AddColumnBeforeIcon]);

    const onInputAccepted = (input: HTMLInputElement) => {
        const value = input.valueAsNumber;

        editor.update(() => {
            const selection = $getSelection();

            let tableNode: ExtendedTableNode | null = null;
            let cellNode: TableCellNode | null = null;
            if ($isRangeSelection(selection)) {
                cellNode = $getTableCellNodeFromLexicalNode(selection.getNodes()[0]);
                if (!cellNode) throw Error("AddColumnBefore: couldn't find node");
                tableNode = $getExtendedTableNodeFromLexicalNodeOrThrow(cellNode);
            }

            if ($isTableSelection(selection)) {
                const tableBodyNode = $getNodeByKeyOrThrow<TableBodyNode>(selection.tableKey);
                tableNode = tableBodyNode.getParentOrThrow<ExtendedTableNode>();
                const resolvedTable = tableBodyNode.getResolvedTable();
                const columnID = resolvedTable[0].cells.length;
                for (const node of selection.getNodes()) {
                    if ($isTableCellNode(node)) {
                        const cellsTableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        if (cellsTableNode == tableBodyNode) {
                            const nodesColumnID = $getTableColumnIndexFromTableCellNode(node, resolvedTable);
                            if (nodesColumnID < columnID) {
                                columnID == columnID;
                                cellNode = node;
                            }
                        }
                    }
                }
            }

            if (!cellNode) throw Error("AddColumnBefore: node not found");
            tableNode?.addColumnsBefore(cellNode, value);
        },
            { tag: 'table-add-column-before' });

        menuContext.closeMenu();
    };

    return (
        <Submenu disableBackground={true}>
            <MenuItem>
                <AddColumnBeforeIcon/>
                <div>Insert Column Before</div>
                <SubmenuIcon/>
            </MenuItem>
            <TableNumberInputContextMenu onInputAccepted={onInputAccepted} />
        </Submenu>
    );
}
