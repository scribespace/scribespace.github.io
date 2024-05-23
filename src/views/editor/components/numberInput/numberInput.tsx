import { separateValueAndUnit, variableExists } from "@utils/common";
import { useMemo, useRef } from "react";
import { IconBaseProps } from "react-icons";
import { SeparatorVertical } from '../separators';

import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import './css/numberInput.css';

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
    const { editorTheme }: MainTheme = useMainThemeContext();
    
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

    const theme = useMemo(()=> {
        return editorTheme.numberInputTheme;
    },[editorTheme.numberInputTheme]);

    function DecreaseIcon(props: IconBaseProps) {
        return theme.DecreaseIcon(props);
    }

    function IncreaseIcon(props: IconBaseProps) {
        return theme.IncreaseIcon(props);
    }

    function AcceptIcon(props: IconBaseProps) {
        return theme.AcceptIcon(props);
    }

    return (
        <div className={theme.container}>
            <DecreaseIcon className={theme.controlButton} onClick={() => { changeValue(-1); }} />
            <input ref={inputRef} className={theme.input} type={props.type} defaultValue={props.defaultValue} onKeyDown={onAccept} />
            <IncreaseIcon className={theme.controlButton} onClick={() => { changeValue(1); }} />
            {props.useAcceptButton && (
                <>
                    <SeparatorVertical/>
                    <AcceptIcon className={theme.acceptButton} onClick={onAccept} />
                </>
            )}
        </div>
    );
}
