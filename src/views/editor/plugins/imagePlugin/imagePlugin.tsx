import { assert } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $insertNodes, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";
import { ImageNode } from "../../nodes/image";
import { $createImageNode } from "../../nodes/image/imageNode";
import { DRAG_DROP_ADD_TYPES_LISTENER_COMMAND } from "../dragDropPlugin";
import { INSERT_IMAGES_COMMAND } from "./imageCommands";

import './css/image.css';


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
                    const imageNode = $createImageNode(undefined, undefined, undefined, image);
                    imageNodes.push(imageNode);
                }

                $insertNodes(imageNodes);
            }

            function dragDropListener(images: File[]) {
                insertImages(images);
            }

            editor.dispatchCommand( DRAG_DROP_ADD_TYPES_LISTENER_COMMAND, {types: supportedFormat, listener: dragDropListener} );

            return mergeRegister( 
                editor.registerCommand(
                    INSERT_IMAGES_COMMAND,
                    (images: File[]) => {
                        insertImages(images);
                        return true;
                    },
                    COMMAND_PRIORITY_LOW
                ),
            );
        },
        [editor]
    );

    return null;
}