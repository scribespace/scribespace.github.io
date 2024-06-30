import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { SET_BACKGROUND_COLOR_CMD } from "@editor/plugins/colorPlugin";
import {
  $closeToolbarMenu,
  TOOLBAR_CLOSE_MENU_CMD,
} from "@editor/plugins/toolbarPlugin/common";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { useEffect, useState } from "react";
import { ColorResult } from "react-color";
import ColorPicker from "./colorPicker";

export default function ColorBackgroundToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      colorTheme: { ColorBackgroundIcon },
    },
  } = useMainThemeContext();

  const onChange = (color: ColorResult) => {
    $callCommand(SET_BACKGROUND_COLOR_CMD, color.hex);
    $closeToolbarMenu();
  };

  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);

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
      className=""
      showSubmenu={showSubmenu}
      setShowSubmenu={setShowSubmenu}
    >
      <MenuItem>
        <ColorBackgroundIcon />
      </MenuItem>
      <ColorPicker onChange={onChange} />
    </Submenu>
  );
}
