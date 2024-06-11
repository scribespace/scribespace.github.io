/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $createPageBreakNode, PageBreakNode } from '@editor/nodes/pageBreak/pageBreakNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    $isRootNode,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND
} from 'lexical';
import { useEffect, useRef } from 'react';
import { CAN_INSERT_PAGE_BREAK_COMMAND, INSERT_PAGE_BREAK_COMMAND } from './pageBreakCommands';


export default function PageBreakPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
    const canInsertPageBreakRef = useRef<boolean>(true);

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode])) {
      throw new Error(
        'PageBreakPlugin: PageBreakNode is not registered on editor',
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK_COMMAND,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = $createPageBreakNode();
            $insertNodeToNearestRoot(pgBreak);
          }

          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
            const selection = $getSelection();
            let canInsertPageBreak = true;
            if ( $isTableSelection(selection) ) {
                canInsertPageBreak = false;
            }
            
            if ( $isRangeSelection(selection) ) {
                for ( const node of selection.getNodes() ) {
                    canInsertPageBreak = canInsertPageBreak && ( $isRootNode(node) || !($isTableNode(node) || node.getTopLevelElementOrThrow().getParent() != $getRoot()));
                }
            }
            
            if ( canInsertPageBreak != canInsertPageBreakRef.current ){
                canInsertPageBreakRef.current = canInsertPageBreak;
                editor.dispatchCommand(CAN_INSERT_PAGE_BREAK_COMMAND, canInsertPageBreak);
            }
            return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
