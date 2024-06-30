import { useMainThemeContext } from "@/mainThemeContext";
import { MenuItem } from "../menu";
import { useCallback } from "react";
import { $callAction } from "@systems/shortcutManager/action";
import { SHORTCUTS_OPEN_DIALOG_ACTION } from "./shortcutsCommands";

export function ShortcutsButton() {
    const {commonTheme: {shortcutsTheme: {ShortcutIcon}}} = useMainThemeContext();

    const onClick = useCallback(
        () => {
            $callAction(SHORTCUTS_OPEN_DIALOG_ACTION);
        },
        []
    );

    return (
      <MenuItem onClick={onClick}>
        <ShortcutIcon />
      </MenuItem>
    );
}