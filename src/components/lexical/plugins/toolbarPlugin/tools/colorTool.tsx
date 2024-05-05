import { MdFormatColorText, MdOutlineFormatColorFill  } from "react-icons/md";

export function BackgroundColorTool() {
    return (
        <MdOutlineFormatColorFill className='item'/>
    )
}

export function TextColorTool() {
    return (
        <MdFormatColorText className='item'/>
    )
}

export default function ColorTools() {
    return (
        <div>
            <TextColorTool/>
            <BackgroundColorTool/>
        </div>
    )
}