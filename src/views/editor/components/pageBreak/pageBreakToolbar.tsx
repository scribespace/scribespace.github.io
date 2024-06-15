import { MenuItem } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { PAGE_BREAK_CAN_INSERT_CMD, PAGE_BREAK_INSERT_CMD } from "@editor/plugins/pageBreakPlugin/pageBreakCommands";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { useCallback, useEffect, useState } from "react";

export function PageBreakToolbar() {
  const [editor] = useLexicalComposerContext();
  const { editorTheme: {pageBreakTheme: { PageBreakIcon }} }: MainTheme = useMainThemeContext();
  const [canInsert, setCanInsert] = useState<boolean>(true);

   const onClick = useCallback(
        () => {
            $callCommand( PAGE_BREAK_INSERT_CMD, undefined );
        },
        []
    );

    useEffect( 
      () => {
        return mergeRegister(
          $registerCommandListener( 
            PAGE_BREAK_CAN_INSERT_CMD,
            (value: boolean) => {
              setCanInsert( value );
              return true;
            }
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