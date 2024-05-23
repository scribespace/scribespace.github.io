import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove, TbTableOff, TbTablePlus } from "react-icons/tb";
import { IconType } from "react-icons";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { Icon } from "@src/components/icon";

export interface TableMenuTheme {
    AddTableIcon: IconType;
    DeleteTableIcon: IconType;
    MergeCellIcon: IconType;
    SplitCellIcon: IconType;
    AddRowBeforeIcon: IconType;
    AddRowAfterIcon: IconType;
    AddColumnBeforeIcon: IconType;
    AddColumnAfterIcon: IconType;
    RemoveRowIcon: IconType;
    RemoveColumnIcon: IconType;
}
export const TABLE_MENU_THEME_DEFAULT: TableMenuTheme = {
    AddTableIcon: Icon( TbTablePlus ),
    DeleteTableIcon: Icon( TbTableOff ),
    MergeCellIcon: Icon( AiOutlineMergeCells ),
    SplitCellIcon: Icon( AiOutlineSplitCells ),
    AddRowBeforeIcon: Icon( TbRowInsertTop ),
    AddRowAfterIcon: Icon( TbRowInsertBottom ),
    AddColumnBeforeIcon: Icon( TbColumnInsertLeft ),
    AddColumnAfterIcon: Icon( TbColumnInsertRight ),
    RemoveRowIcon: Icon( TbRowRemove ),
    RemoveColumnIcon: Icon( TbColumnRemove ),
};
