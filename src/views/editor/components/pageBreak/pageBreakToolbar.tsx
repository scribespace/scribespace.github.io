import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { CAN_INSERT_PAGE_BREAK, INSERT_PAGE_BREAK } from "@editor/plugins/pageBreakPlugin/pageBreakCommands";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useCallback, useEffect, useState } from "react";

export function PageBreakToolbar() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme: {pageBreakTheme: { PageBreakIcon }} }: MainTheme = useMainThemeContext();
  const [canInsert, setCanInsert] = useState<boolean>(true);

   const onClick = useCallback(
        () => {
            editor.dispatchCommand( INSERT_PAGE_BREAK, undefined );
        },
        [editor]
    );

    useEffect( 
      () => {
        return mergeRegister(
          editor.registerCommand( 
            CAN_INSERT_PAGE_BREAK,
            (value: boolean) => {
              setCanInsert( value );
              return true;
            },
            COMMAND_PRIORITY_LOW
          )
        );
      },
      [editor]
    );

    return (
        <>
          <MenuItem disabled={!canInsert} onClick={onClick}>
            <PageBreakIcon />
          </MenuItem>
        </>
      );
}