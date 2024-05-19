import { useContext } from "react";
import { ContextMenuContext, ContextMenuContextObject } from "../../contextMenuPlugin";
import NumberInputEditor from "../../../../editors/numberInputEditor";

interface TableContextNumberInputEditorProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export default function TableContextNumberInputEditor({ onInputAccepted }: TableContextNumberInputEditorProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext);

    return (
        <div className={contextObject.theme.contextMenuEditorContainer}>
            <NumberInputEditor type="number" defaultValue="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
