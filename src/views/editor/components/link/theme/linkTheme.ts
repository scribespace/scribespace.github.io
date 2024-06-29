import { Icon } from "@/components";
import { IconType } from "react-icons";
import { HiExternalLink } from "react-icons/hi";
import { MdEdit, MdLink } from "react-icons/md";
import "./css/link.css";
import { CSSTheme } from "@utils";

export interface LinkTheme {
  editor: CSSTheme;
  container: CSSTheme;
  icon: CSSTheme;
  input: CSSTheme;
  button: CSSTheme;

  TextIcon: IconType;
  LinkIcon: IconType;
  OpenIcon: IconType;
}

export const LINK_THEME_DEFAULT: LinkTheme = {
  editor: "link-editor-default",
  container: "link-input-container-default",
  icon: "link-input-icon-default",
  input: "link-input-text-default",
  button: "link-input-icon-default",

  TextIcon: Icon(MdEdit),
  LinkIcon: Icon(MdLink),
  OpenIcon: Icon(HiExternalLink),
};
