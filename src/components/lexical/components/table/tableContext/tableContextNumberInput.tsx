import { useContext } from "react";
import NumberInput from "../../numberInput/numberInput";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuContext";
import { MenuContext } from "../../menu/menu";

interface TableContextNumberInputProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export default function TableContextNumberInput({ onInputAccepted }: TableContextNumberInputProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    return (
        <div className={menuContext.theme.contextMenuEditorContainer}>
            <NumberInput type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
