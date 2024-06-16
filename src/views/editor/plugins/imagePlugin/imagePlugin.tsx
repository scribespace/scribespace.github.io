import { IMAGE_SUPPORTED_FORMATS } from "@/system/imageManager";
import { $createImageNode, $isImageNode } from "@editor/nodes/image/imageNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { assert } from "@utils";
import {
  $getSelection,
  $insertNodes,
  $isNodeSelection,
} from "lexical";
import { useCallback, useEffect } from "react";
import { ImageNode } from "../../nodes/image";
import { EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD } from "../dragDropPlugin";
import { INSERT_IMAGES_CMD } from "./imageCommands";
import { KEY_DELETE_CMD, KEY_BACKSPACE_CMD } from "../commandsPlugin/editorCommands";

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

    $callCommand(EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD, {
      types: Object.getOwnPropertyNames(IMAGE_SUPPORTED_FORMATS),
      listener: dragDropListener,
    });

    return mergeRegister(
      $registerCommandListener(
        INSERT_IMAGES_CMD,
        (images: File[]) => {
          insertImages(images);
          return true;
        },
      ),
      $registerCommandListener(
        KEY_DELETE_CMD,
        onDelete,
      ),
      $registerCommandListener(
        KEY_BACKSPACE_CMD,
        onDelete,
      ),
    );
  }, [editor, onDelete]);

  return null;
}
