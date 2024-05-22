import { useEffect, useRef } from "react";
import { validateUrl, OpenURL } from "@utils/common";
import { EditorTheme, useEditorThemeContext } from "../../editorThemeContext";
import { IconBaseProps } from "react-icons";
interface LinkEditorProps {
    text?: string;
    url?: string;

    onTextChange?: (text:string) => void;
    onURLChange?: (url:string) => void;
}

export default function LinkEditor({text, url, onTextChange, onURLChange}: LinkEditorProps) {
    const editorTheme: EditorTheme = useEditorThemeContext();
    function getTheme() {
        return editorTheme.linkTheme!;
    }

    const urlInput = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLInputElement>(null);
    const currentURL = useRef<string>('');
    
    function OpenURLFromInput() {
        const url = urlInput.current?.value;
        if ( url )
            OpenURL(url);
    }

    function TextChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
        if ( e.key == "Enter" && onTextChange) {
            onTextChange((e.target as HTMLInputElement).value);
            e.preventDefault();
        }
    }

    function URLChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
        const inputeElement = (e.target as HTMLInputElement);
        if ( e.key == "Enter" && onURLChange) {
            if ( validateUrl(inputeElement.value) ) {
                onURLChange(inputeElement.value);
                currentURL.current = inputeElement.value;
            } else {
                inputeElement.value = currentURL.current;
            }
            e.preventDefault();
        }
    }

    useEffect(() => {
        if ( textInput.current && text )
            textInput.current.value = text;
    },[text]);

    useEffect(() => {
        if ( urlInput.current && url != undefined ) {
            urlInput.current.value = url;
            currentURL.current = url;
        }
    },[url]);

    function TextIcon(props: IconBaseProps) {
        return getTheme().TextIcon!(props);
    }

    function LinkIcon(props: IconBaseProps) {
        return getTheme().LinkIcon!(props);
    }

    function OpenIcon(props: IconBaseProps) {
        return getTheme().OpenIcon!(props);
    }

    return (
    <div className={getTheme().editor}>
        <div className={getTheme().container}>
            <TextIcon className={getTheme().icon}/>
            <input ref={textInput} type="text" className={getTheme().input} defaultValue={text ? text : url} onKeyDown={TextChangeAccepted}/>
        </div>
        <div className={getTheme().container}>
            <LinkIcon className={getTheme().icon}/>
            <input ref={urlInput} type="text" className={getTheme().input} defaultValue={url} onKeyDown={URLChangeAccepted}/>
            <OpenIcon className={getTheme().button} onClick={OpenURLFromInput}/>
        </div>
    </div>
);
}