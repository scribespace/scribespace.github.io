import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove, TbTableOff, TbTablePlus } from "react-icons/tb";
import { IconType } from "react-icons";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { TfiLayoutColumn2 } from "react-icons/tfi";
import { Icon } from "@/components";

export interface TableLayoutMenuTheme {
    TableAddIcon: IconType;
    LayoutAddIcon: IconType;
    DeleteIcon: IconType;
    MergeCellIcon: IconType;
    SplitCellIcon: IconType;
    RowAddBeforeIcon: IconType;
    RowAddAfterIcon: IconType;
    ColumnAddBeforeIcon: IconType;
    ColumnAddAfterIcon: IconType;
    RowRemoveIcon: IconType;
    ColumnRemoveIcon: IconType;
}
export const TABLE_LAYOUT_MENU_THEME_DEFAULT: TableLayoutMenuTheme = {
    TableAddIcon: Icon( TbTablePlus ),
    LayoutAddIcon: Icon( TfiLayoutColumn2 ),
    DeleteIcon: Icon( TbTableOff ),
    MergeCellIcon: Icon( AiOutlineMergeCells ),
    SplitCellIcon: Icon( AiOutlineSplitCells ),
    RowAddBeforeIcon: Icon( TbRowInsertTop ),
    RowAddAfterIcon: Icon( TbRowInsertBottom ),
    ColumnAddBeforeIcon: Icon( TbColumnInsertLeft ),
    ColumnAddAfterIcon: Icon( TbColumnInsertRight ),
    RowRemoveIcon: Icon( TbRowRemove ),
    ColumnRemoveIcon: Icon( TbColumnRemove ),
};
