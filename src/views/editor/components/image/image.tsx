import { useMainThemeContext } from "@/mainThemeContext";
import { appGlobals } from "@/system/appGlobals";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { useEffect, useRef, useState } from "react";
import { $isImageNode } from "../../nodes/image/imageNode";

interface ImageProps {
    src?: string;
    blob?: Blob;
    imageKey: NodeKey;
}

interface ImageSrc {
    src: string;
    loading: boolean;
}

const MISSING_IMAGE = '/images/no-image.png';

export function Image( { src, blob, imageKey } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {commonTheme: {pulsing}, editorTheme: {imageTheme}} = useMainThemeContext();

    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(imageKey);

    const [imageSrc, setImageSrc] = useState<ImageSrc>({src: src || '', loading: false});

    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(
        () => {
            if ( imageSrc.src == '' && blob ) {
                setImageSrc( {src: MISSING_IMAGE, loading: true} );
                appGlobals.urlObjManager.blobsToUrlObjs(
                    (urlsObjs) => {
                        setImageSrc( {src: urlsObjs[0], loading: false} );

                        editor.update( 
                            () => {
                                const imageNode = $getNodeByKey( imageKey );
                                if ( $isImageNode(imageNode) ) {
                                    imageNode.setSrc( urlsObjs[0] );
                                }
                            }
                         );
                    },
                    undefined,
                    [blob]
                );
            }
        },
        [blob, editor, imageKey, imageSrc.src]
    );

    useEffect(
        () => {
            return editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    if ( event.target == imageRef.current ) {
                        clearSelection();
                        setSelected(true);
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            );
        },
        [clearSelection, editor,  setSelected]
    );

    return (
        <div className={(isSelected ? " " + imageTheme.selected : '')} style={{display: "inline-block", overflow: "hidden", maxWidth: "100%", width: "max-content", height: "max-content", margin: "0", padding: "0"}}>
            <img ref={imageRef} className={imageTheme.element + (imageSrc.loading ? (' ' + pulsing): '')} src={imageSrc.src} alt={`No image ${imageSrc.src}`}/>
        </div>
    );
}
