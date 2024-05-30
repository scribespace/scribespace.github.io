import { useMainThemeContext } from "@/mainThemeContext";
import { appGlobals } from "@/system/appGlobals";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { useEffect, useRef, useState } from "react";

const IMAGE_STATE_PLACEHOLDER = 0 as const;
const IMAGE_STATE_LOADING = 1 as const;
const IMAGE_STATE_URL_OBJ = 2 as const;
const IMAGE_STATE_LINK = 3 as const;
const IMAGE_STATE_MISSING = 4 as const;
type ImageState = typeof IMAGE_STATE_PLACEHOLDER | typeof IMAGE_STATE_LOADING | typeof IMAGE_STATE_URL_OBJ | typeof IMAGE_STATE_LINK | typeof IMAGE_STATE_MISSING;

interface ImageLoadingState {
    src: string;
    state: ImageState;
}

interface ImageProps {
    src?: string;
    file?: File;
    nodeKey: NodeKey;
}

export function Image( { file, nodeKey } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {commonTheme: {pulsing}, editorTheme: {imageTheme}} = useMainThemeContext();

    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [imageLoadingState, setImageLoadingState] = useState<ImageLoadingState>( {src: '/images/no-image.png', state: IMAGE_STATE_PLACEHOLDER} );

    const imageRef = useRef<HTMLImageElement>(null);
    const fileCopyRef = useRef<Blob | null>(null);

    useEffect(
        () => {
            if ( fileCopyRef.current == null && file ) {
                fileCopyRef.current = new Blob([file]);

                setImageLoadingState( (current) => {return {...current, state: IMAGE_STATE_LOADING}; });
                appGlobals.urlObjManager.blobToUrlObj( 
                    (urlObj: string) => {
                        setImageLoadingState( {src: urlObj, state: IMAGE_STATE_URL_OBJ});
                    }, 
                    undefined, 
                    fileCopyRef.current 
                );
            }
        },
        [file]
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
            <img ref={imageRef} className={imageTheme.element + (imageLoadingState.state == IMAGE_STATE_LOADING ? (' ' + pulsing): '')} src={imageLoadingState.src} alt={`No image ${imageLoadingState.src}`}/>
        </div>
    );
}
