import { LexicalComposerContextType } from "@lexical/react/LexicalComposerContext";
import { forwardRef, useEffect, useRef } from "react";
import { MdEdit, MdLink } from "react-icons/md";
import { HiExternalLink } from "react-icons/hi";
import { validateUrl } from "./linkPlugin";
interface LinkEditorProps {
    composerContext: LexicalComposerContextType;

    text?: string;
    url?: string;

    onTextChange?: (text:string) => void;
    onURLChange?: (url:string) => void;
}

export function OpenURL(url: string) {
    if ( validateUrl(url) ) {
        const validURL = url;// url.match(/^https?:/) ? url : '//' + url;
        window.open(validURL, '_blank')?.focus();
    }
}

export const LinkEditor = forwardRef<HTMLDivElement, LinkEditorProps>( ({composerContext, text, url, onTextChange, onURLChange}: LinkEditorProps, ref)  => {
    const urlInput = useRef<HTMLInputElement>(null)
    const textInput = useRef<HTMLInputElement>(null)
    const currentURL = useRef<string>('')
    
    const theme = composerContext.getTheme();
    const editorClassName           = theme && theme.linkPlugin ? theme.linkPlugin.linkEditor                   : 'link-editor-default'
    const inputContainerClassName   = theme && theme.linkPlugin ? theme.linkPlugin.linkInputContainer           : 'link-input-container-default'
    const inputIconClassName        = theme && theme.linkPlugin ? theme.linkPlugin.linkIconContainer            : 'link-input-icon-default'
    const inputTextClassName        = theme && theme.linkPlugin ? theme.linkPlugin.linkInputText                : 'link-input-text-default'
    const inputIconButtonClassName  = inputIconClassName + ' ' + (theme && theme.linkPlugin ? theme.linkPlugin.linkIconButtonContainer : 'link-input-icon-default')

    function OpenURLFromInput() {
        const url = urlInput.current?.value;
        if ( url )
            OpenURL(url)
    }

    function TextChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
        if ( e.key == "Enter" && onTextChange) {
            onTextChange((e.target as HTMLInputElement).value)
            e.preventDefault();
        }
    }

    function URLChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
        const inputeElement = (e.target as HTMLInputElement);
        if ( e.key == "Enter" && onURLChange) {
            if ( validateUrl(inputeElement.value) ) {
                onURLChange(inputeElement.value)
                currentURL.current = inputeElement.value
            } else {
                inputeElement.value = currentURL.current
            }
            e.preventDefault();
        }
    }

    useEffect(() => {
        if ( textInput.current && text )
            textInput.current.value = text;
    },[text])

    useEffect(() => {
        if ( urlInput.current && url != undefined ) {
            urlInput.current.value = url;
            currentURL.current = url;
        }
    },[url])

    return (
    <div ref={ref} className={editorClassName}>
        <div className={inputContainerClassName}>
            <MdEdit className={inputIconClassName}/>
            <input ref={textInput} type="text" className={inputTextClassName} defaultValue={text ? text : url} onKeyDown={TextChangeAccepted}/>
        </div>
        <div className={inputContainerClassName}>
            <MdLink className={inputIconClassName}/>
            <input ref={urlInput} type="text" className={inputTextClassName} defaultValue={url} onKeyDown={URLChangeAccepted}/>
            <HiExternalLink className={inputIconButtonClassName} onClick={OpenURLFromInput}/>
        </div>
    </div>
)
})