import { Icon } from "@/components";
import { IconType } from "react-icons";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";

import './css/list.css';

export interface ListTheme {
  ListNumberIcon: IconType;
  ListBulletIcon: IconType;
}

export const LIST_THEME_DEFAULT: ListTheme = {
    ListNumberIcon: Icon(MdFormatListNumbered),
    ListBulletIcon: Icon(MdFormatListBulleted),
};
