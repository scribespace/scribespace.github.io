import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import { $isPageBreakNode } from '@editor/nodes/pageBreak/pageBreakNode';
import { CLICK_CMD, KEY_BACKSPACE_CMD, KEY_DELETE_CMD } from '@editor/plugins/commandsPlugin/commands';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { $registerCommandListener } from '@systems/commandsManager/commandsManager';
import { $getNodeByKey, $getSelection, $isNodeSelection, NodeKey } from "lexical";
import { useCallback, useEffect } from "react";

export function PageBreak({ nodeKey }: { nodeKey: NodeKey; }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const { editorTheme: {pageBreakTheme: { pageBreakFiller }} }: MainTheme = useMainThemeContext();

  const $onDelete = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      if (isSelected && $isNodeSelection($getSelection())) {
        const node = $getNodeByKey(nodeKey);
        if ($isPageBreakNode(node)) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  useEffect(() => {
    return mergeRegister(
      $registerCommandListener(
        CLICK_CMD,
        (event: MouseEvent) => {
          const pbElem = editor.getElementByKey(nodeKey);

          if (event.target === pbElem) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }
          
          return false;
        }
      ),
      $registerCommandListener(
        KEY_DELETE_CMD,
        $onDelete,
      ),
      $registerCommandListener(
        KEY_BACKSPACE_CMD,
        $onDelete,
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected]);

  useEffect(() => {
    const pbElem = editor.getElementByKey(nodeKey);
    if (pbElem !== null) {
      pbElem.className = pageBreakFiller + (isSelected ? ' selected' : '');
    }
  }, [editor, isSelected, nodeKey, pageBreakFiller]);

  return null;
}
