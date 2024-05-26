import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { DRAG_DROP_ADD_TYPES_LISTENER_COMMAND } from "../dragDropPlugin";
import { INSERT_IMAGES_COMMAND } from "./imageCommands";
import { $insertNodes, COMMAND_PRIORITY_LOW } from "lexical";
import { assert } from "@/utils";
import { ImageNode } from "../../nodes/image";
import { $createImageNode } from "../../nodes/image/imageNode";

export function ImagePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => {
            assert(editor.hasNode(ImageNode), "ImageNode not registered");

            const supportedFormat: string[] = [
                "image/bmp",
                "image/jpeg",
                "image/png",
                "image/webp",
            ];

            function insertImages(images: File[]) {
                const imageNodes: ImageNode[] = [];

                for ( const image of images ) {
                    const imageNode = $createImageNode();
                    imageNode.setImageFile(image);
                    imageNodes.push(imageNode);
                }
                $insertNodes(imageNodes);
            }

            function dragDropListener(images: File[]) {
                insertImages(images);
            }

            editor.dispatchCommand( DRAG_DROP_ADD_TYPES_LISTENER_COMMAND, {types: supportedFormat, listener: dragDropListener} );

            return editor.registerCommand(
                INSERT_IMAGES_COMMAND,
                (images: File[]) => {
                    insertImages(images);
                    return true;
                },
                COMMAND_PRIORITY_LOW
            );
        },
        [editor]
    );

    return null;
}