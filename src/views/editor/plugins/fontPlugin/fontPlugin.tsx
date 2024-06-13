import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import {
  $getNearestBlockElementAncestorOrThrow,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";
import {
  CLEAR_FONT_STYLE_COMMAND,
  DECREASE_FONT_SIZE_COMMAND,
  FONT_FAMILY_CHANGED_COMMAND,
  FONT_SIZE_CHANGED_COMMAND,
  INCREASE_FONT_SIZE_COMMAND,
  SET_FONT_FAMILY_COMMAND,
  SET_FONT_SIZE_COMMAND,
} from "./fontCommands";
import { Font, fontFromStyle } from "@utils";

export function FontPlugin() {
  const [editor] = useLexicalComposerContext();
  const {
    editorTheme: {
      editorInputTheme: { defaultFontSize },
    },
    editorTheme: {
      editorInputTheme: { defaultFontFamily },
    },
  }: MainTheme = useMainThemeContext();
  const fontSizeRef = useRef<string>(defaultFontSize);
  const fontFamilyRef = useRef<Font>(defaultFontFamily);

  const updateCurrentFont = useCallback(
    () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const currnetFontSize = $getSelectionStyleValueForProperty( selection, "font-size", defaultFontSize );
        if ( fontSizeRef.current != currnetFontSize) {
          fontSizeRef.current = currnetFontSize;
          editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, currnetFontSize);
        }
        const cssFontFamily = $getSelectionStyleValueForProperty( selection, "font-family", defaultFontFamily.name );
        const font = cssFontFamily == "" ? defaultFontFamily : fontFromStyle(cssFontFamily);
        if ( font.name != fontFamilyRef.current.name ) {
          fontFamilyRef.current = font;
          editor.dispatchCommand(FONT_FAMILY_CHANGED_COMMAND, font);
        }
      }
    },
    [defaultFontFamily, defaultFontSize, editor]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateCurrentFont();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CLEAR_FONT_STYLE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const focus = selection.focus;
            const nodes = selection.getNodes();

            if (anchor.key === focus.key && anchor.offset === focus.offset) {
              return false;
            }

            const start = anchor.isBefore( focus ) ? anchor : focus;
            const end = anchor.isBefore( focus ) ? focus : anchor;

            nodes.forEach((node, idx) => {
              // We split the first and last node by the selection
              // So that we don't format unselected text inside those nodes
              if ($isTextNode(node)) {
                if (idx === 0 && start.offset !== 0) {
                  node = node.splitText(start.offset)[1] || node;
                }
                if (idx === nodes.length - 1) {
                  node = (node as TextNode).splitText(end.offset)[0] || node;
                }

                if ((node as TextNode).__style !== "") {
                  (node as TextNode).setStyle("");
                }
                if ((node as TextNode).__format !== 0) {
                  (node as TextNode).setFormat(0);
                  $getNearestBlockElementAncestorOrThrow(node).setFormat("");
                }
              } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
                node.replace($createParagraphNode(), true);
              } else if ($isDecoratorBlockNode(node)) {
                node.setFormat("");
              }
            });

            updateCurrentFont();
          }
          return false; // propagation
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateCurrentFont]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INCREASE_FONT_SIZE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, {
              "font-size": (currentValue) => {
                if (!currentValue) {
                  currentValue = defaultFontSize;
                }

                let size = Number(
                  (currentValue.match(/\d+/g) as RegExpMatchArray)[0],
                );
                const unit = currentValue.match(/[a-zA-Z]+/g);
                size += 1;
                return size + (unit ? unit[0] : "");
              },
            });

            updateCurrentFont();
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        DECREASE_FONT_SIZE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, {
              "font-size": (currentValue) => {
                if (!currentValue) {
                  currentValue = defaultFontSize;
                }

                let size = Number(
                  (currentValue.match(/\d+/g) as RegExpMatchArray)[0],
                );
                const unit = currentValue.match(/[a-zA-Z]+/g);
                size -= 1;
                return size + (unit ? unit[0] : "");
              },
            });
            updateCurrentFont();
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        SET_FONT_SIZE_COMMAND,
        (fontSize: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-size": fontSize });
            updateCurrentFont();
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [defaultFontSize, editor, updateCurrentFont]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SET_FONT_FAMILY_COMMAND,
        (fontFamily: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-family": fontFamily });
            updateCurrentFont();
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [defaultFontFamily, editor, updateCurrentFont]);
  return null;
}
