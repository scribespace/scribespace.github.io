import { MdFormatColorText, MdOutlineFormatColorFill  } from "react-icons/md";
import { ColorChangeHandler, ColorResult, CompactPicker } from 'react-color';
import { ToolbarToolProps } from "./toolsProps";
import { SET_BACKGROUND_COLOR_COMMAND, SET_FONT_COLOR_COMMAND } from "../../../commands";
import DropdownTool from "./dropdownTool";

type ColorPickerProps = {
    onChange: ColorChangeHandler;
};

export function ColorPicker({onChange}: ColorPickerProps) {
    return (
        <div style={{boxShadow:'0px 5px 10px rgba(0, 0, 0, 0.582)'}}>
            <CompactPicker onChange={onChange}/>
        </div>
    );
}

export function BackgroundColorTool({editor}: ToolbarToolProps) {

    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_BACKGROUND_COLOR_COMMAND, color.hex);
    };

    const Tool = () => {
        return <MdOutlineFormatColorFill className='item'/>;
     };

     return (
        <DropdownTool Tool={Tool}>
                <ColorPicker onChange={onChange}/>
        </DropdownTool>
    );
}

export function TextColorTool({editor}: ToolbarToolProps) {

    const onChange = (color: ColorResult) => {
        editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color.hex);
    };

    const Tool = () => {
        return <MdFormatColorText className='item'/>;
     };
 
     return (
         <DropdownTool Tool={Tool}>
                 <ColorPicker onChange={onChange}/>
         </DropdownTool>
     );
}

export default function ColorTools({editor}: ToolbarToolProps) {
    return (
        <div style={{display: 'flex'}}>
            <TextColorTool editor={editor}/>
            <BackgroundColorTool editor={editor}/>
        </div>
    );
}