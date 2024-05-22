import { TbColumnInsertLeft, TbColumnInsertRight, TbColumnRemove, TbRowInsertBottom, TbRowInsertTop, TbRowRemove, TbTableOff, TbTablePlus } from "react-icons/tb";
import { IconType } from "react-icons";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";

export interface TableMenuTheme {
    AddTableIcon?: IconType;
    DeleteTableIcon?: IconType;
    MergeCellIcon?: IconType;
    SplitCellIcon?: IconType;
    AddRowBeforeIcon?: IconType;
    AddRowAfterIcon?: IconType;
    AddColumnBeforeIcon?: IconType;
    AddColumnAfterIcon?: IconType;
    RemoveRowIcon?: IconType;
    RemoveColumnIcon?: IconType;
}
export const TABLE_MENU_THEME_DEFAULT: TableMenuTheme = {
    AddTableIcon: TbTablePlus,
    DeleteTableIcon: TbTableOff,
    MergeCellIcon: AiOutlineMergeCells,
    SplitCellIcon: AiOutlineSplitCells,
    AddRowBeforeIcon: TbRowInsertTop,
    AddRowAfterIcon: TbRowInsertBottom,
    AddColumnBeforeIcon: TbColumnInsertLeft,
    AddColumnAfterIcon: TbColumnInsertRight,
    RemoveRowIcon: TbRowRemove,
    RemoveColumnIcon: TbColumnRemove,
};
