import { SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, $getSelection, $isRangeSelection } from "lexical";
import {$getSelectionStyleValueForProperty} from '@lexical/selection'
import { useEffect, useRef } from "react";
import { SET_FONT_FAMILY_COMMAND } from "../../../commands";
import DropdownTool, { DropdownList } from "./dropdownTool";
import { ToolbarToolProps } from "./toolsProps";

import { FaAngleDown } from "react-icons/fa";

export default function FontFamilyTool({editor}: ToolbarToolProps) {
    const fontFamilies = [
        "Arial, sans-serif",
        "Verdana, sans-serif",
        "Tahoma, sans-serif",
        "Trebuchet MS, sans-serif",
        "Times New Roman, serif",
        "Georgia, serif",
        "Garamond, serif",
        "Courier New, monospace",
        "Brush Script MT, cursive",
    ];
    const defaultFontFamily = useRef<string>('')
    const toolRef = useRef<HTMLButtonElement>(null)
    const dropdownListRef = useRef<HTMLDivElement>(null)

    type FontFamilyProps = {
        fontFamily: string;
    }
    
    function FontFamilyButton({fontFamily} : FontFamilyProps) {
        return (
            <button className='item' onClick={() => {editor.dispatchCommand(SET_FONT_FAMILY_COMMAND, fontFamily)}}>
                <span style={{fontFamily: fontFamily}}>{fontFamily}</span>
            </button>
        )
    }

    const Tool = () => {
        return (
            <div className="item font-family">
                <button ref={toolRef} className="button">{defaultFontFamily.current}</button>
                <FaAngleDown className="icon"/>
            </div>
        )
    }

    useEffect(() => {
        defaultFontFamily.current = getComputedStyle(document.documentElement).getPropertyValue("--default-font-family");

            const removeSelectionChanage = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                const selection = $getSelection();
                if ( $isRangeSelection(selection) ) {
                    if ( toolRef.current )
                        toolRef.current.innerHTML = ($getSelectionStyleValueForProperty(selection, 'font-family', defaultFontFamily.current))
                }
              return false;
            },
            COMMAND_PRIORITY_LOW
          )
          return () => {removeSelectionChanage()}
    }, [])

    return (
        <DropdownTool Tool={Tool} dropdownElementRef={dropdownListRef}>
            <DropdownList ref={dropdownListRef}>
            {
                fontFamilies.map((fontFamily, id) => {
                    return <FontFamilyButton key={id} fontFamily={fontFamily}/>
                })
            }
            </DropdownList>
        </DropdownTool>
    )
}