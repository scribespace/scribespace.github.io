import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import {
  $closeToolbarMenu,
  TOOLBAR_CLOSE_MENU_COMMAND,
} from "@/views/editor/plugins/toolbarPlugin/common";
import { useToolbarContext } from "@/views/editor/plugins/toolbarPlugin/context";
import { LAYOUT_INSERT_COMMAND } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useCallback, useEffect, useState } from "react";
import NumberInput from "../../../numberInput";

export function LayoutCreateToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      tableLayoutTheme: {
        menuTheme: { LayoutAddIcon },
      },
    },
  } = useMainThemeContext();
  const {
    theme: { horizontalContainer },
  } = useToolbarContext();
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

  const onInputAccept = useCallback(
    (input: HTMLInputElement) => {
        const cols = input.valueAsNumber;
        editor.dispatchCommand( LAYOUT_INSERT_COMMAND, cols );
        $closeToolbarMenu(editor);
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOOLBAR_CLOSE_MENU_COMMAND,
        () => {
          setShowSubmenu(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, showSubmenu, setShowSubmenu]);

  return (
    <Submenu
      className={horizontalContainer}
      showSubmenu={showSubmenu}
      setShowSubmenu={setShowSubmenu}
    >
      <MenuItem>
        <LayoutAddIcon />
      </MenuItem>
      <NumberInput
        type="number"
        value="2"
        min={2}
        useAcceptButton={true}
        onInputAccepted={onInputAccept}
      />
    </Submenu>
  );
}
