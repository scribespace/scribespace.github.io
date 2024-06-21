import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $isTableSelection } from "@lexical/table";
import {
  mergeRegister
} from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { Font, fontFromStyle, fontToStyle } from "@utils";
import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection
} from "lexical";
import { useCallback, useEffect, useRef } from "react";
import { SELECTION_CHANGE_CMD } from "../commandsPlugin/editorCommands";
import {
  CLEAR_FONT_STYLE_CMD,
  DECREASE_FONT_SIZE_CMD,
  FONT_FAMILY_CHANGED_CMD,
  FONT_SIZE_CHANGED_CMD,
  INCREASE_FONT_SIZE_CMD,
  SET_FONT_FAMILY_CMD,
  SET_FONT_SIZE_CMD,
} from "./fontCommands";
import { $clearFormat } from "./fontHelpers";

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
          $callCommand(FONT_SIZE_CHANGED_CMD, currnetFontSize);
        }
        const cssFontFamily = $getSelectionStyleValueForProperty( selection, "font-family", defaultFontFamily.name );
        const font = cssFontFamily == "" ? fontFamilyRef.current : fontFromStyle(cssFontFamily);
        if ( font.name != fontFamilyRef.current.name ) {
          fontFamilyRef.current = font;
          $callCommand(FONT_FAMILY_CHANGED_CMD, font);
        }
      }
    },
    [defaultFontFamily.name, defaultFontSize]
  );

  const getStyle = useCallback( ( fontSize: string, fontFamily: Font ) => { return `font-size: ${fontSize}; font-family: ${fontToStyle(fontFamily)}`; }, [] );

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        SELECTION_CHANGE_CMD,
        () => {
          updateCurrentFont();
          return false;
        },
      ),
      $registerCommandListener(
        CLEAR_FONT_STYLE_CMD,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {

            if (selection.isCollapsed()) {
              $callCommand(SET_FONT_SIZE_CMD, defaultFontSize);
              $callCommand(SET_FONT_FAMILY_CMD, fontToStyle(defaultFontFamily));
              return false;
            }

            const anchor = selection.anchor;
            const focus = selection.focus;

            const start = selection.isBackward() ? focus : anchor;
            const startOffset = start.offset;
            let startNode = start.getNode();
            const end = selection.isBackward() ? anchor : focus;
            const endOffset = end.offset;
            let endNode = end.getNode();

            if ( startNode.is(endNode) ) {
              if ( $isTextNode(startNode) && $isTextNode(endNode) ) {
                startNode = startNode.splitText(startOffset)[1] || startNode;
                endNode = startNode.splitText( endOffset - startOffset )[0] || endNode;
              }
            } else {
              if ( $isTextNode(startNode) ) {
                startNode = startNode.splitText( startOffset )[1] || startNode;
              }
              if( $isTextNode( endNode ) ) {
                endNode = endNode.splitText(endOffset)[0] || endNode;
              }
            }

            $clearFormat(startNode, getStyle(defaultFontSize, defaultFontFamily), startNode, endNode);
            $clearFormat(endNode, getStyle(defaultFontSize, defaultFontFamily), startNode, endNode);

            const nodes = selection.getNodes();
            for ( let n = 1; n < nodes.length - 1; ++n ) {
              const node = nodes[n];
              $clearFormat(node, getStyle(defaultFontSize, defaultFontFamily), startNode, endNode);
            }

            const newAnchorNode = selection.isBackward() ? endNode : startNode;
            const newAnchorOffset = selection.isBackward() ? ( endNode.is(startNode) ? (endOffset - startOffset) : endOffset ) : 0;
            const newFocusNode = selection.isBackward() ? startNode : endNode;
            const newFocusOffset = selection.isBackward() ? 0 : (endNode.is(startNode) ? (endOffset - startOffset) : endOffset );

            const newSelection = $createRangeSelection();
            newSelection.anchor.set( newAnchorNode.getKey(), newAnchorOffset, anchor.type );
            newSelection.focus.set( newFocusNode.getKey(), newFocusOffset, focus.type );

            $setSelection(newSelection);
          } else if ( $isTableSelection(selection)) {
            for ( const node of selection.getNodes() ) {
              $clearFormat(node, getStyle(defaultFontSize, defaultFontFamily), null, null);
            }
          }
        },
      ),
    );
  }, [defaultFontFamily, defaultFontSize, editor, getStyle, updateCurrentFont]);

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        INCREASE_FONT_SIZE_CMD,
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
      ),

      $registerCommandListener(
        DECREASE_FONT_SIZE_CMD,
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
      ),

      $registerCommandListener(
        SET_FONT_SIZE_CMD,
        (fontSize: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-size": fontSize });
            updateCurrentFont();
          }

          return false;
        },
      ),
    );
  }, [defaultFontSize, editor, updateCurrentFont]);

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        SET_FONT_FAMILY_CMD,
        (fontFamily: string) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-family": fontFamily });
            updateCurrentFont();
          }

          return false;
        },
      ),
    );
  }, [defaultFontFamily, editor, updateCurrentFont]);

  return null;
}