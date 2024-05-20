import { useMemo, useRef } from "react";
import { PiCheckSquareOffsetBold } from "react-icons/pi";
import { copyExistingValues, separateValueAndUnit, variableExists } from "../../../../common";
import { EditorThemeClassName } from "lexical";
import { IconBaseProps, IconType } from "react-icons";

import './css/numberInputEditor.css';
import { SeparatorVertical } from "../separator";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";

export interface NumberInputEditorIcons {
    IncreaseIcon: IconType;
    DecreaseIcon: IconType;
    AcceptIcon: IconType;
}

const NUMBER_INPUT_EDITOR_DEFAULT_ICONS: NumberInputEditorIcons = {
    IncreaseIcon: HiPlusSm,
    DecreaseIcon: HiMinusSm,
    AcceptIcon: PiCheckSquareOffsetBold,
}

export interface NumberInputEditorTheme {
    container?: EditorThemeClassName;
    controlButton?: EditorThemeClassName;
    acceptButton?: EditorThemeClassName;
    input?: EditorThemeClassName;
}

export const NUMBER_INPUT_EDITOR_DEFAULT_THEME: NumberInputEditorTheme = {
    container: "number-input-editor-container-default",
    controlButton: "number-input-editor-button-default",
    acceptButton: "number-input-editor-button-default",
    input: "number-input-editor-input-default",
}

interface NumberInputEditorProps {
    theme?: NumberInputEditorTheme;
    icons?: Partial<NumberInputEditorIcons>;
    type: 'text' | 'number';
    defaultValue: string;
    min?: number;
    max?: number;
    useAcceptButton?: boolean;
    onInputChanged?: (target: HTMLInputElement) => void;
    onInputAccepted?: (target: HTMLInputElement) => void;
}

export default function NumberInputEditor(props: NumberInputEditorProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const icons = useMemo(() => copyExistingValues<NumberInputEditorIcons>(props.icons, NUMBER_INPUT_EDITOR_DEFAULT_ICONS), [props.icons])
    const theme = useMemo(() => copyExistingValues(props.theme, NUMBER_INPUT_EDITOR_DEFAULT_THEME), [props.theme])


    function correctValue(value: number): number {
        if (props.min) value = Math.max(props.min, value)
        if (props.max) value = Math.min(props.max, value)

        return value;
    }

    function changeValue(change: number) {
        if (!inputRef.current) return

        const valueStr = inputRef.current.value;
        const valueUnit = separateValueAndUnit(valueStr);

        if (!variableExists(valueUnit.value)) throw Error("increaseValue: number not found")

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

    function DecreaseIcon(props: IconBaseProps) {
        return icons.DecreaseIcon(props)
    }

    function IncreaseIcon(props: IconBaseProps) {
        return icons.IncreaseIcon(props)
    }

    function AcceptIcon(props: IconBaseProps) {
        return icons.AcceptIcon(props)
    }

    return (
        <div className={theme.container}>
            <DecreaseIcon className={theme.controlButton} onClick={() => { changeValue(-1) }} />
            <input ref={inputRef} className={theme.input} type={props.type} defaultValue={props.defaultValue} onKeyDown={onAccept} />
            <IncreaseIcon className={theme.controlButton} onClick={() => { changeValue(1) }} />
            {props.useAcceptButton && (
                <>
                    <SeparatorVertical />
                    <AcceptIcon className={theme.acceptButton} onClick={onAccept} />
                </>
            )}
        </div>
    )
}
