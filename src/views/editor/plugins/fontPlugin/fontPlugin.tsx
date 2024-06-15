import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $isTableSelection } from "@lexical/table";
import {
  mergeRegister
} from "@lexical/utils";
import { Font, fontFromStyle, fontToStyle } from "@utils";
import {
  $createRangeSelection,
  $getNodeByKeyOrThrow,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
  TextNode
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
        const currnetFontSize = $getSelectionStyleValueForProperty( selection, "font-size", fontSizeRef.current );
        if ( fontSizeRef.current != currnetFontSize) {
          fontSizeRef.current = currnetFontSize;
          editor.dispatchCommand(FONT_SIZE_CHANGED_COMMAND, currnetFontSize);
        }
        const cssFontFamily = $getSelectionStyleValueForProperty( selection, "font-family", fontFamilyRef.current.name );
        const font = cssFontFamily == "" ? fontFamilyRef.current : fontFromStyle(cssFontFamily);
        if ( font.name != fontFamilyRef.current.name ) {
          fontFamilyRef.current = font;
          editor.dispatchCommand(FONT_FAMILY_CHANGED_COMMAND, font);
        }
      }
    },
    [editor]
  );

  const getStyle = useCallback( ( fontSize: string, fontFamily: Font ) => { return `font-size: ${fontSize}; font-family: ${fontToStyle(fontFamily)}`; }, [] );

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

            if (selection.isCollapsed()) {
              editor.dispatchCommand(SET_FONT_SIZE_COMMAND, defaultFontSize);
              editor.dispatchCommand(SET_FONT_FAMILY_COMMAND, fontToStyle(defaultFontFamily));
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
          return false; // propagation
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [defaultFontFamily, defaultFontSize, editor, getStyle, updateCurrentFont]);

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

  useEffect( 
    () => {
      return editor.registerMutationListener( 
        TextNode,
        (nodes) => {
          const newNodes: NodeKey[] = [];

          editor.getEditorState().read( 
            () => {
              for ( const [key, mutation] of nodes ) {
                if ( mutation == "created" ) {
                  const node = $getNodeByKeyOrThrow<TextNode>(key);

                  if ( !node.getStyle().includes('font-size') || !node.getStyle().includes('font-family') )
                    newNodes.push(key);
                }
              }
            });

          if ( newNodes.length == 0) return;

          editor.update(
            () => {
              for ( const key of newNodes ) {
                const node = $getNodeByKeyOrThrow<TextNode>(key);
                const style = node.getStyle();
                let newStyle = "";
                if ( !style.includes('font-size')) {
                  newStyle += `font-size: ${fontSizeRef.current};`;
                }

                if ( !style.includes('font-family')) {
                  newStyle += `font-family: ${fontToStyle(fontFamilyRef.current)};`;
                }

                node.setStyle( newStyle + style );
              }
            }
          );
        }
       );
    },
    [editor]
  );

  return null;
}