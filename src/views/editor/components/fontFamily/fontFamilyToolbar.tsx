import { $getSelectionStyleValueForProperty } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useEffect, useRef, useState } from "react";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { SET_FONT_FAMILY_COMMAND } from "@/views/editor/plugins/fontPlugin";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Font, fontFromStyle, fontToStyle } from "@utils";
import { Submenu, MenuItem } from "@/components/menu";

const fontFamilies: Font[] = [
  { name: "Arial", alt: "sans-serif" },
  { name: "Verdana", alt: "sans-serif" },
  { name: "Tahoma", alt: "sans-serif" },
  { name: "Georgia", alt: "serif" },
  { name: "Garamond", alt: "serif" },
  { name: "Times New Roman", alt: "serif" },
  { name: "Trebuchet MS", alt: "sans-serif" },
  { name: "Courier New", alt: "monospace" },
  { name: "Brush Script MT", alt: "cursive" },
];

export default function FontFamilyToolbar() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      editorInputTheme: { defaultFontFamily },
    },
  }: MainTheme = useMainThemeContext();
  const {
    theme: { fontFamily },
    theme: { itemSelected },
  } = useToolbarContext();
  const [selectedFamily, setSelectedFamily] = useState<string>("");

  const toolRef = useRef<HTMLDivElement>(null);

  function onSelect(selectedFontFamily: Font) {
    const cssFontFamily = fontToStyle(selectedFontFamily);
    editor.dispatchCommand(SET_FONT_FAMILY_COMMAND, cssFontFamily);
  }

  useEffect(() => {
    if (!toolRef.current || selectedFamily == "") return;
    toolRef.current.innerHTML = selectedFamily;
  }, [selectedFamily]);

  useEffect(() => {
    const updateStates = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (toolRef.current) {
          const cssFontFamily = $getSelectionStyleValueForProperty(
            selection,
            "font-family",
            defaultFontFamily.name
          );
          const font = fontFromStyle(cssFontFamily);
          setSelectedFamily(font.name);
        }
      }
    };

    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateStates();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateStates();
        });
      })
    );
  }, [defaultFontFamily, editor]);

  return (
    <Submenu>
      <MenuItem>
        <div
          ref={toolRef}
          className={fontFamily}
          style={{ fontFamily: fontToStyle(defaultFontFamily) }}
        >
          {defaultFontFamily.name}
        </div>
      </MenuItem>
      {fontFamilies.map((currentFontFamily, id) => {
        return (
          <div
            key={id * 3 + 0}
            className={
              currentFontFamily.name === selectedFamily ? itemSelected : ""
            }
          >
            <MenuItem
              key={id * 3 + 1}
              onClick={() => onSelect(currentFontFamily)}
            >
              <div
                key={id * 3 + 2}
                style={{ fontFamily: fontToStyle(currentFontFamily) }}
              >
                {currentFontFamily.name}
              </div>
            </MenuItem>
          </div>
        );
      })}
    </Submenu>
  );
}
