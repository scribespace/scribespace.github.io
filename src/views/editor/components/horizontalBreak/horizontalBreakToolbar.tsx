import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { INSERT_HORIZONTAL_RULE_CMD } from "@editor/plugins/commandsPlugin/commands";
import { $callCommand } from "@systems/commandsManager/commandsManager";
import { useCallback } from "react";

export function HorizontalBreakToolbar() {
  const { editorTheme: {horizontalBreakTheme: { HorizontalBreakIcon}} }: MainTheme = useMainThemeContext();

   const onClick = useCallback(
        () => {
            $callCommand( INSERT_HORIZONTAL_RULE_CMD, undefined );
        },
        []
    );

    return (
        <>
          <MenuItem onClick={onClick}>
            <HorizontalBreakIcon />
          </MenuItem>
        </>
      );
}