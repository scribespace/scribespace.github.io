import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { useCallback } from "react";

export function HorizontalBreakToolbar() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme: {horizontalBreakTheme: { HorizontalBreakIcon}} }: MainTheme = useMainThemeContext();

   const onClick = useCallback(
        () => {
            editor.dispatchCommand( INSERT_HORIZONTAL_RULE_COMMAND, undefined );
        },
        [editor]
    );

    return (
        <>
          <MenuItem onClick={onClick}>
            <HorizontalBreakIcon />
          </MenuItem>
        </>
      );
}