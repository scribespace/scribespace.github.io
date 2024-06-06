import { assert } from "@utils";
import { $createImageNode, $isImageNode, ImageNode } from "@editor/nodes/image";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useCallback, useEffect } from "react";
import { DRAG_DROP_ADD_TYPES_LISTENER_COMMAND } from "../dragDropPlugin";
import { INSERT_IMAGES_COMMAND } from "./imageCommands";

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  const onDelete = useCallback((event: KeyboardEvent) => {
    const selection = $getSelection();
    if ($isNodeSelection(selection)) {
      event.preventDefault();
      let nodeDeleted = false;
      for (const node of selection.getNodes()) {
        if ($isImageNode(node)) {
          node.remove();
          nodeDeleted = true;
        }
      }

      return nodeDeleted;
    }
    return false;
  }, []);

  useEffect(() => {
    assert(editor.hasNode(ImageNode), "ImageNode not registered");

    const supportedFormat: string[] = [
      "image/bmp",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    function insertImages(images: File[]) {
      const imageNodes: ImageNode[] = [];

      for (const image of images) {
        const imageNode = $createImageNode(
          undefined,
          undefined,
          undefined,
          image,
        );
        imageNodes.push(imageNode);
      }

      $insertNodes(imageNodes);
    }

    function dragDropListener(images: File[]) {
      insertImages(images);
    }

    editor.dispatchCommand(DRAG_DROP_ADD_TYPES_LISTENER_COMMAND, {
      types: supportedFormat,
      listener: dragDropListener,
    });

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGES_COMMAND,
        (images: File[]) => {
          insertImages(images);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, onDelete]);

  return null;
}
