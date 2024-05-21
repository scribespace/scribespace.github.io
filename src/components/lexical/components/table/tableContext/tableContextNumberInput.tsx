import {NumberInput} from "../../numberInput";
import { getContextMenuContext } from "../../../plugins/contextMenuPlugin/contextMenuContext";

interface TableContextNumberInputProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export default function TableContextNumberInput({ onInputAccepted }: TableContextNumberInputProps) {
    const menuContext = getContextMenuContext()

    return (
        <div className={menuContext.theme.contextMenuEditorContainer}>
            <NumberInput type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
