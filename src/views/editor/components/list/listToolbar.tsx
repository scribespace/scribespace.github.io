import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";

export function ListToolbar() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme: {listTheme: {ListBulletIcon, ListNumberIcon}} }: MainTheme = useMainThemeContext();

    const onClickBullet = useCallback(
        () => {
            editor.dispatchCommand( INSERT_UNORDERED_LIST_COMMAND, undefined );
        },
        [editor]
    );

    const onClickNumbers = useCallback(
        () => {
            editor.dispatchCommand( INSERT_ORDERED_LIST_COMMAND, undefined );
        },
        [editor]
    );

    return (
        <>
          <MenuItem onClick={onClickBullet}>
            <ListBulletIcon />
          </MenuItem>
          <MenuItem onClick={onClickNumbers}>
            <ListNumberIcon />
          </MenuItem>
        </>
      );
}