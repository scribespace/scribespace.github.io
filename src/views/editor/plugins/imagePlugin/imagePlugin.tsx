import { $getImageManager } from "@/system/imageManager";
import { $createImageNode, $isImageNode } from "@editor/nodes/image/imageNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $callCommand, $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { IMAGE_SUPPORTED_FORMATS, MISSING_IMAGE } from "@systems/imageManager/imageConstants";
import { assert } from "@utils";
import {
  $getSelection,
  $insertNodes,
  $isNodeSelection,
} from "lexical";
import { useCallback, useEffect } from "react";
import { ImageNode } from "../../nodes/image";
import { KEY_BACKSPACE_CMD, KEY_DELETE_CMD } from "../commandsPlugin/editorCommands";
import { EDITOR_DRAG_DROP_ADD_TYPES_LISTENER_CMD } from "../dragDropPlugin";
import { INSERT_IMAGES_CMD } from "./imageCommands";

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

  const insertImages = useCallback(
    (images: File[]) => {
      const imageNodes: ImageNode[] = [];

      for (const image of images) {
        const imageID = $getImageManager().imageUpload(image);

        const imageNode = $createImageNode(
          imageID,
          MISSING_IMAGE,
          undefined,
          undefined,
          undefined,
        );
        imageNodes.push(imageNode);
      }

      $insertNodes(imageNodes);
    },
    []
  );

  useEffect(() => {
    assert(editor.hasNode(ImageNode), "ImageNode not registered");

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
  }, [editor, insertImages, onDelete]);

  return null;
}
