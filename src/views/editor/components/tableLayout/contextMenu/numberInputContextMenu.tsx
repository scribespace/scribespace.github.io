import NumberInput from "../../numberInput";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";

interface ContextNumberInputProps {
    onInputAccepted: (target: HTMLInputElement) => void;
}

export function NumberInputContextMenu({ onInputAccepted }: ContextNumberInputProps) {
    const menuContext = useContextMenuContext();

    return (
        <div className={menuContext.theme?.editorContainer}>
            <NumberInput type="number" value="1" min={1} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
