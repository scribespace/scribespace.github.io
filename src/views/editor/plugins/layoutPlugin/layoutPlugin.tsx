import { assert } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $isLayoutBodyNode,
  LayoutBodyNode,
  LayoutNode,
} from "../../nodes/layout";
import {
  HTMLTableElementWithWithTableSelectionState,
  TableObserver,
  applyTableHandlers,
} from "@lexical/table";
import { $getNodeByKey, $nodesOfType, NodeKey } from "lexical";

export function LayoutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    assert(
      editor.hasNodes([LayoutNode, LayoutBodyNode]),
      "LayoutNode, LayoutBodyNode not registerd in editor",
    );
  }, [editor]);

  useEffect(() => {
    const layoutSelections = new Map<NodeKey, TableObserver>();

    const initializeLayoutNode = (layoutBodyNode: LayoutBodyNode) => {
      const nodeKey = layoutBodyNode.getKey();
      const tableElement = editor.getElementByKey(
        nodeKey,
      ) as HTMLTableElementWithWithTableSelectionState;
      if (tableElement && !layoutSelections.has(nodeKey)) {
        const layoutBodySelection = applyTableHandlers(
          layoutBodyNode,
          tableElement,
          editor,
          true,
        );
        layoutSelections.set(nodeKey, layoutBodySelection);
      }
    };

    // Plugins might be loaded _after_ initial content is set, hence existing table nodes
    // won't be initialized from mutation[create] listener. Instead doing it here,
    editor.getEditorState().read(() => {
      const tableNodes = $nodesOfType(LayoutBodyNode);
      for (const tableNode of tableNodes) {
        if ($isLayoutBodyNode(tableNode)) {
          initializeLayoutNode(tableNode);
        }
      }
    });

    const unregisterMutationListener = editor.registerMutationListener(
      LayoutBodyNode,
      (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === "created") {
            editor.getEditorState().read(() => {
              const layoutBodyNode = $getNodeByKey<LayoutBodyNode>(nodeKey);
              if ($isLayoutBodyNode(layoutBodyNode)) {
                initializeLayoutNode(layoutBodyNode);
              }
            });
          } else if (mutation === "destroyed") {
            const layoutBodySelection = layoutSelections.get(nodeKey);

            if (layoutBodySelection !== undefined) {
              layoutBodySelection.removeListeners();
              layoutSelections.delete(nodeKey);
            }
          }
        }
      },
    );

    return () => {
      unregisterMutationListener();
      // Hook might be called multiple times so cleaning up tables listeners as well,
      // as it'll be reinitialized during recurring call
      for (const [, layoutSelection] of layoutSelections) {
        layoutSelection.removeListeners();
      }
    };
  }, [editor]);

  return null;
}
