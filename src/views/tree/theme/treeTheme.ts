import { IconType } from "react-icons";
import { AiOutlineFileAdd, AiOutlineDelete } from "react-icons/ai";

export interface TreeTheme {
    AddIcon?: IconType;
    DeleteIcon?: IconType;
}

export const TREE_THEME_DEFAULT: TreeTheme = {
    AddIcon: AiOutlineFileAdd,
    DeleteIcon: AiOutlineDelete,
};