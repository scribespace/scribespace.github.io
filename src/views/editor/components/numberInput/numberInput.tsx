import { useRef } from "react";
import { separateValueAndUnit, variableExists } from "@utils/common";
import { IconBaseProps } from "react-icons";
import { SeparatorVertical } from '../separators';

import './css/numberInput.css';
import { useEditorThemeContext, EditorTheme } from "../../editorThemeContext";

interface NumberInputProps {
    type: 'text' | 'number';
    defaultValue: string;
    min?: number;
    max?: number;
    useAcceptButton?: boolean;
    onInputChanged?: (target: HTMLInputElement) => void;
    onInputAccepted?: (target: HTMLInputElement) => void;
}

export default function NumberInput(props: NumberInputProps) {
    const editorTheme: EditorTheme = useEditorThemeContext();
    
    const inputRef = useRef<HTMLInputElement>(null);

    function correctValue(value: number): number {
        if (props.min) value = Math.max(props.min, value);
        if (props.max) value = Math.min(props.max, value);

        return value;
    }

    function changeValue(change: number) {
        if (!inputRef.current) return;

        const valueStr = inputRef.current.value;
        const valueUnit = separateValueAndUnit(valueStr);

        if (!variableExists(valueUnit.value)) throw Error("increaseValue: number not found");

        valueUnit.value = valueUnit.value! + change;

        const correctedValue = correctValue(valueUnit.value);

        if (correctedValue == valueUnit.value) {
            inputRef.current.value = valueUnit.value.toString() + (valueUnit.unit ? valueUnit.unit : '');

            if (props.onInputChanged)
                props.onInputChanged(inputRef.current);
        }
    }

    function onAccept() {
        if (!inputRef.current) return;

        const valueStr = inputRef.current.value;
        const valueUnit = separateValueAndUnit(valueStr);

        if (!variableExists(valueUnit.value)) {
            return;
        }

        const correctedValue = correctValue(valueUnit.value!);
        if (correctedValue != valueUnit.value) {
            inputRef.current.value = correctedValue.toString() + (valueUnit.unit ? valueUnit.unit : '');
            return;
        }

        if (props.onInputAccepted)
            props.onInputAccepted(inputRef.current);
    }

    function getTheme() {
        return editorTheme.numberInputTheme!;
    }

    function DecreaseIcon(props: IconBaseProps) {
        return getTheme().DecreaseIcon!(props);
    }

    function IncreaseIcon(props: IconBaseProps) {
        return getTheme().IncreaseIcon!(props);
    }

    function AcceptIcon(props: IconBaseProps) {
        return getTheme().AcceptIcon!(props);
    }

    return (
        <div className={getTheme().container}>
            <DecreaseIcon className={getTheme().controlButton} onClick={() => { changeValue(-1); }} />
            <input ref={inputRef} className={getTheme().input} type={props.type} defaultValue={props.defaultValue} onKeyDown={onAccept} />
            <IncreaseIcon className={getTheme().controlButton} onClick={() => { changeValue(1); }} />
            {props.useAcceptButton && (
                <>
                    <SeparatorVertical/>
                    <AcceptIcon className={getTheme().acceptButton} onClick={onAccept} />
                </>
            )}
        </div>
    );
}
