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
import { $callCommand, $registerCommandListener } from '@systems/commandsManager/commandsManager';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootNode
} from 'lexical';
import { useEffect, useRef } from 'react';
import { SELECTION_CHANGE_CMD } from '../commandsPlugin/commands';
import { PAGE_BREAK_CAN_INSERT_CMD, PAGE_BREAK_INSERT_CMD } from './pageBreakCommands';


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
      $registerCommandListener(
        PAGE_BREAK_INSERT_CMD,
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
      ),
      $registerCommandListener(
        SELECTION_CHANGE_CMD,
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
                $callCommand(PAGE_BREAK_CAN_INSERT_CMD, canInsertPageBreak);
            }
            return true;
        },
      )
    );
  }, [editor]);

  return null;
}
