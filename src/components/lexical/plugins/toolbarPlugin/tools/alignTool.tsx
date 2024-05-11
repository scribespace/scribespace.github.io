import { ImParagraphCenter, ImParagraphJustify, ImParagraphLeft, ImParagraphRight } from "react-icons/im"
import DropdownTool, { DropdownList } from "./dropdownTool"
import { ToolbarToolProps } from "./toolsProps";
import { FORMAT_ELEMENT_COMMAND } from "lexical";

export default function AlignTool({editor}: ToolbarToolProps) {
    const onClickLeft = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
    }

    const onClickCenter = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
    }

    const onClickRight = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
    }

    const onClickJustify = () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
    }

    const Tool = () => {
        return <ImParagraphLeft className="item"/>
    }

    return (
        <DropdownTool Tool={Tool}>
            <DropdownList>
                <ImParagraphLeft className="item-buttons" onClick={onClickLeft}/>
                <ImParagraphCenter className="item-buttons" onClick={onClickCenter}/>
                <ImParagraphRight className="item-buttons" onClick={onClickRight}/>
                <ImParagraphJustify className="item-buttons" onClick={onClickJustify}/>
            </DropdownList>
        </DropdownTool>
    )
}