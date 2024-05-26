import { useMainThemeContext } from "@/mainThemeContext";
import { variableExists } from "@/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";

const IMAGE_STATE_PLACEHOLDER = 0 as const;
const IMAGE_STATE_URL_OBJ = 1 as const;
const IMAGE_STATE_LINK = 2 as const;
type ImageState = typeof IMAGE_STATE_PLACEHOLDER | typeof IMAGE_STATE_URL_OBJ | typeof IMAGE_STATE_LINK;

interface ImageProps {
    src?: string;
    file?: File;
    placeholder?: string;
}

export function Image( { src, file, placeholder = '/images/no-image.png' } : ImageProps) {
    const [editor] = useLexicalComposerContext();
    const {commonTheme: {pulsing}, editorTheme: {editorInputTheme: {image}}} = useMainThemeContext();
    const [targetSrc, setTargetSrc] = useState<string>(src || placeholder);
    const [isProcessing, setIsProcessing] = useState<boolean>(true);
    const [imageState, setImageState] = useState<ImageState>(IMAGE_STATE_PLACEHOLDER);

    useEffect(
        () => {
            if ( variableExists(src) ) return;
            if ( !variableExists(file) ) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                if (!e.target || !e.target.result) return;
                const imgURL = e.target.result as string;
                setTargetSrc(imgURL);
                setImageState(IMAGE_STATE_URL_OBJ);
            };
            reader.readAsDataURL(file);
        },
        [editor, file, src]
    );

    const onLoad = useCallback(
        () => {
            if ( imageState == IMAGE_STATE_URL_OBJ ) {
                setIsProcessing(false);
                console.log('test');
            }
        },
        [imageState]
    );

    return (
        <img className={image + (isProcessing ? ' ' + pulsing : '')} src={targetSrc} alt={`No image ${targetSrc}`} onLoad={onLoad}/>
    );
}