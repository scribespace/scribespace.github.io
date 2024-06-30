import { mergeRegister } from "@lexical/utils";
import { useEffect, useRef, useState } from "react";

import { MenuItem, Submenu } from "@/components/menu";
import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { FONT_FAMILY_CHANGED_CMD, SET_FONT_FAMILY_CMD } from "@/views/editor/plugins/fontPlugin";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { Font, fontToStyle } from "@utils";

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
    $callCommand(SET_FONT_FAMILY_CMD, cssFontFamily);
  }

  useEffect(() => {
    if (!toolRef.current || selectedFamily == "") return;
    toolRef.current.innerHTML = selectedFamily;
  }, [selectedFamily]);

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener( 
        FONT_FAMILY_CHANGED_CMD,
        (font: Font) => {
          setSelectedFamily(font.name);
          return false;
        }
      )
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
