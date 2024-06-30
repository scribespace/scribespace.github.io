import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import {
  $closeToolbarMenu,
  TOOLBAR_CLOSE_MENU_CMD,
} from "@/views/editor/plugins/toolbarPlugin/common";
import { useToolbarContext } from "@/views/editor/plugins/toolbarPlugin/context";
import { LAYOUT_INSERT_CMD } from "@editor/plugins/tableLayoutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
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
        $callCommand( LAYOUT_INSERT_CMD, cols );
        $closeToolbarMenu();
    },
    [],
  );

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        TOOLBAR_CLOSE_MENU_CMD,
        () => {
          setShowSubmenu(false);
          return false;
        }
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
