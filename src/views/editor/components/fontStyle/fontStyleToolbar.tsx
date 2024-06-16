import { MenuItem } from "@/components/menu";
import { $menuItemParent } from "@/components/menu/theme";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { CLEAR_FONT_STYLE_CMD } from "@/views/editor/plugins/fontPlugin";
import { FORMAT_TEXT_CMD, SELECTION_CHANGE_CMD } from "@editor/plugins/commandsPlugin/editorCommands";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import {
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

export default function FontStyleToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: { fontStyleTheme },
    editorTheme: {
      toolbarTheme: {
        menuTheme: { itemSelected },
      },
    },
  }: MainTheme = useMainThemeContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateStates = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    if (editor) {
      return mergeRegister(
        $registerCommandListener(
          SELECTION_CHANGE_CMD,
          () => {
            updateStates();
            return false;
          }
        ),
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateStates();
          });
        }),
      );
    }
  }, [editor, updateStates]);

  const onClickBold = () => {
    $callCommand( FORMAT_TEXT_CMD, "bold" );
  };

  const onClickItalic = () => {
    $callCommand(FORMAT_TEXT_CMD, "italic");
  };

  const onClickUnderline = () => {
    $callCommand(FORMAT_TEXT_CMD, "underline");
  };

  const onClickStrikethrough = () => {
    $callCommand(FORMAT_TEXT_CMD, "strikethrough");
  };

  const onClickClearFormatting = () => {
    $callCommand(CLEAR_FONT_STYLE_CMD, undefined);
  };

  return (
    <>
      <div className={isBold ? itemSelected : ""} style={$menuItemParent}>
        <MenuItem onClick={onClickBold}>
          <fontStyleTheme.BoldIcon />
        </MenuItem>
      </div>
      <div className={isItalic ? itemSelected : ""} style={$menuItemParent}>
        <MenuItem onClick={onClickItalic}>
          <fontStyleTheme.ItalicIcon />
        </MenuItem>
      </div>
      <div className={isUnderline ? itemSelected : ""} style={$menuItemParent}>
        <MenuItem onClick={onClickUnderline}>
          <fontStyleTheme.UnderlineIcon />
        </MenuItem>
      </div>
      <div
        className={isStrikethrough ? itemSelected : ""}
        style={$menuItemParent}
      >
        <MenuItem onClick={onClickStrikethrough}>
          <fontStyleTheme.StrikethroughIcon />
        </MenuItem>
      </div>
      <MenuItem onClick={onClickClearFormatting}>
        <fontStyleTheme.ClearFormattingIcon />
      </MenuItem>
    </>
  );
}
