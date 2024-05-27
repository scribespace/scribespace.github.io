import useTraceUpdate from "@/hooks/useTraceUpdate";
import { useWebWorker } from "@/hooks/useWebWorker";
import { useMainThemeContext } from "@/mainThemeContext";
import { variableExists } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

interface ImageLoadingState {
    src: string;
    state: number;
}

export default function ImageComponent( { src, file, nodeKey } : ImageProps) {
    const [editor] = useLexicalComposerContext();

    const {commonTheme: {pulsing}, editorTheme: {imageTheme}} = useMainThemeContext();

    const [targetSrc, setTargetSrc] = useState<string>('/images/no-image.png');
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [imageState, setImageState] = useState<ImageState>(IMAGE_STATE_PLACEHOLDER);

    const imageRef = useRef<HTMLImageElement>(null);


    const webWorkerArgs = useMemo(()=> {return {file};},[file]);
    const webWorkerFunc = useCallback(
        async (args: unknown) => {
            const {file} = args as {file?: File};

            function asyncLoadImageFile(file: File) {
                return new Promise<string>( 
                    (resolve, reject) => {
                        // const reader = new FileReader();
    
                        // reader.onload = function (e) {
                        //     if (!e.target || !e.target.result) return;
                        //     const imgURL = e.target.result as string;                        
                        //     resolve(imgURL);                    
                        // };
                        // reader.onerror = function (event) {
                        //     reject(event);
                        // };
    
                        // reader.readAsDataURL(file);

                        resolve( URL.createObjectURL(file) );
                    }
                );
            }

            if ( file ) {
                return {src:await asyncLoadImageFile(file), state: 1};
            }

            return {src:'/images/no-image.png', state: -1};
        },
        []
    );

    const imageLoaded = useWebWorker<ImageLoadingState>( 
        webWorkerFunc,
        webWorkerArgs,
        {src: '/images/no-image.png', state: 0}
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
        <>
        <div className={(isSelected ? " " + imageTheme.selected : '')} style={{display: "inline-block", overflow: "hidden", maxWidth: "100%", width: "max-content", height: "max-content", margin: "0", padding: "0"}}>
            <img ref={imageRef} className={imageTheme.element + (imageLoaded.state == 0 ? (' ' + pulsing): '')} src={imageLoaded.src} alt={`No image ${targetSrc}`}/>
        </div>
        </>
    );
}
