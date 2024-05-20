import { useContext } from "react";
import NumberInputEditor from "../../numberInputEditor/numberInputEditor";
import { ContextMenuContextData } from "../../../plugins/contextMenuPlugin/contextMenuContext";
import { MenuContext } from "../../menu/menu";

interface TableContextNumberInputEditorProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export default function TableContextNumberInputEditor({ onInputAccepted }: TableContextNumberInputEditorProps) {
    const menuContext = useContext(MenuContext) as ContextMenuContextData

    return (
        <div className={menuContext.theme.contextMenuEditorContainer}>
            <NumberInputEditor type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
