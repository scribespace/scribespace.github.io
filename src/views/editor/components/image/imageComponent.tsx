import { useMainThemeContext } from "@/mainThemeContext";
import { variableExists } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { useEffect, useRef, useState } from "react";

const IMAGE_STATE_PLACEHOLDER = 0 as const;
const IMAGE_STATE_LOADING = 1 as const;
const IMAGE_STATE_URL_OBJ = 2 as const;
const IMAGE_STATE_LINK = 3 as const;
const IMAGE_STATE_MISSING = 3 as const;
type ImageState = typeof IMAGE_STATE_PLACEHOLDER | typeof IMAGE_STATE_LOADING | typeof IMAGE_STATE_URL_OBJ | typeof IMAGE_STATE_LINK | typeof IMAGE_STATE_MISSING;

interface ImageProps {
    src?: string;
    file?: File;
    nodeKey: NodeKey;
}

export default function ImageComponent( { src, file, nodeKey } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {commonTheme: {pulsing}, editorTheme: {imageTheme}} = useMainThemeContext();

    const [targetSrc, setTargetSrc] = useState<string>('/images/no-image.png');
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [imageState, setImageState] = useState<ImageState>(IMAGE_STATE_PLACEHOLDER);

    const imageRef = useRef<HTMLImageElement>(null);
    
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

    useEffect( 
        () => {
            let isMounted = true;

            function asyncLoadImageFile(file: File) {
                return new Promise<string>( 
                    (resolve, reject) => {
                        const reader = new FileReader();
    
                        reader.onload = function (e) {
                            if (!e.target || !e.target.result) return;
                            const imgURL = e.target.result as string;                        
                            resolve(imgURL);                    
                        };
                        reader.onerror = function (event) {
                            reject(event);
                        };
    
                        reader.readAsDataURL(file);
                    }
                );
            }

            function asyncWaitForImage(src: string) {
                return new Promise<string>(
                    (resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(src);
                        img.onerror = reject;
                        img.src = src;
                    }
                );
            }

            async function asyncImageLoad(src: string) {
                await asyncWaitForImage(src);
                setTargetSrc(src);
                setImageState(IMAGE_STATE_URL_OBJ);
            }

            async function asyncImageFileLoad(file: File) {
                const src = await asyncLoadImageFile(file);
                await asyncWaitForImage(src);
                setTargetSrc(src);
                setImageState(IMAGE_STATE_URL_OBJ);
            }

            if ( imageState != IMAGE_STATE_PLACEHOLDER )
                return;


            if ( src ) {
                setImageState( IMAGE_STATE_LOADING );
                asyncImageLoad(src);            
            } else if ( variableExists(file) ) {
                setImageState( IMAGE_STATE_LOADING );
                asyncImageFileLoad(file);
            } else {
                setImageState( IMAGE_STATE_MISSING );
            }
            
            return () => {isMounted = false;};
        },
        [file, imageState, src, targetSrc]
    );

    return (
        <>
        <div className={(isSelected ? " " + imageTheme.selected : '')} style={{display: "inline-block", overflow: "hidden", maxWidth: "100%", width: "max-content", height: "max-content", margin: "0", padding: "0"}}>
            <img ref={imageRef} className={imageTheme.element + (imageState == IMAGE_STATE_LOADING ? (' ' + pulsing): '')} src={targetSrc} alt={`No image ${targetSrc}`}/>
        </div>
        </>
    );
}
