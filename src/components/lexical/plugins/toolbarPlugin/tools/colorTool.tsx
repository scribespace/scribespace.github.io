import { MdFormatColorText, MdOutlineFormatColorFill  } from "react-icons/md";
import { IconBaseProps } from 'react-icons'
import { ColorChangeHandler, ColorResult, CompactPicker } from 'react-color'
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToolbarToolProps } from "./toolsProps";
import { SET_BACKGROUND_COLOR_COMMAND, SET_FONT_COLOR_COMMAND } from "../../../commands";

type ColorPickerProps = {
    parentRef: React.RefObject<HTMLElement>;
    setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
    onChange: ColorChangeHandler;
}

function ColorPicker({parentRef, setShowColorPicker, onChange}: ColorPickerProps) {
    const colorPickerRef = useRef<HTMLDivElement>(null)   

    const HandleClick = ({target}: MouseEvent) => {
        if ( colorPickerRef && !colorPickerRef.current?.contains(target as Node) && 
            parentRef && !parentRef.current?.contains(target as Node)){
                setShowColorPicker(false);
        }
    }

    useEffect(()=> {
        const parentObject = parentRef.current;
        const colorPickerObject = colorPickerRef.current;
        if ( parentObject != null && colorPickerObject != null ){
            const { top, left, width } = parentObject.getBoundingClientRect();
            const {width: listhWidth } = colorPickerObject.getBoundingClientRect();
            colorPickerObject.style.top = `${top + 40}px`;
            colorPickerObject.style.left = `${left + (width * 0.5) - (listhWidth * 0.5)}px`;
        }

        document.addEventListener('click', HandleClick)
        return () => {document.removeEventListener('click', HandleClick)}
    }, [])

    return (
        <div ref={colorPickerRef} style={{zIndex: '5', display: 'block', position: 'absolute'}}>
            <CompactPicker onChange={onChange}/>
        </div>
    )
}

interface ColorToolProps {
    ToolIcon: React.ComponentType<IconBaseProps>
    onChange: ColorChangeHandler;
}

export function ColorTool({ToolIcon, onChange}: ColorToolProps) {
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement>(null)
    
   
    return (
        <div ref={buttonRef}>
            <ToolIcon className='item' onClick={()=>setShowColorPicker(current => !current)}/>
            {showColorPicker && createPortal(
                <ColorPicker parentRef={buttonRef} setShowColorPicker={setShowColorPicker} onChange={onChange}/>
            , document.body)}
        </div>
    )
}

export function BackgroundColorTool({editor}: ToolbarToolProps) {

    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_BACKGROUND_COLOR_COMMAND, color.hex);
    }

    return (
        <ColorTool ToolIcon={MdOutlineFormatColorFill} onChange={onChange} />
    )
}

export function TextColorTool({editor}: ToolbarToolProps) {
    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color.hex);
    }

    return (
        <ColorTool ToolIcon={MdFormatColorText} onChange={onChange} />
    )
}

export default function ColorTools({editor}: ToolbarToolProps) {
    return (
        <div style={{display: 'flex'}}>
            <TextColorTool editor={editor}/>
            <BackgroundColorTool editor={editor}/>
        </div>
    )
}