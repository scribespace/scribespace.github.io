import NumberInput from "../../numberInput";
import { useContextMenuContext } from "@editor/plugins/contextMenuPlugin/context";

interface ContextNumberInputProps {
    value?: number;
    min?: number;
    onInputAccepted: (target: HTMLInputElement) => void;
}

export function NumberInputContextMenu({ value=1, min=1, onInputAccepted }: ContextNumberInputProps) {
    const menuContext = useContextMenuContext();

    return (
        <div className={menuContext.theme?.editorContainer}>
            <NumberInput type="number" value={value.toString()} min={min} useAcceptButton={true} onInputAccepted={onInputAccepted} />
        </div>
    );
}
