import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { INSERT_ORDERED_LIST_CMD, INSERT_UNORDERED_LIST_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { useCallback } from "react";

export function ListToolbar() {
  const { editorTheme: {listTheme: {ListBulletIcon, ListNumberIcon}} }: MainTheme = useMainThemeContext();

    const onClickBullet = useCallback(
        () => {
            $callCommand( INSERT_UNORDERED_LIST_CMD, undefined );
        },
        []
    );

    const onClickNumbers = useCallback(
        () => {
            $callCommand( INSERT_ORDERED_LIST_CMD, undefined );
        },
        []
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

