import { ValueUnit, separateValueAndUnit, variableExists } from "@utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { IconBaseProps } from "react-icons";

import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import './css/numberInput.css';
import { SeparatorVertical } from "@/components/separators";
import { NumberInputTheme } from "./theme";

interface NumberInputProps {
    type: 'text' | 'number';
    value: string;
    min?: number;
    max?: number;
    useAcceptButton?: boolean;
    supportedUnits?: string[];
    themeOverride?: NumberInputTheme;
    onInputChanged?: (target: HTMLInputElement, change: number) => void;
    onInputAccepted?: (target: HTMLInputElement) => void;
}

export default function NumberInput({type, value, min, max, useAcceptButton, supportedUnits, themeOverride, onInputChanged, onInputAccepted}: NumberInputProps) {
    const { editorTheme }: MainTheme = useMainThemeContext();
    
    const inputRef = useRef<HTMLInputElement>(null);
    const currentValueRef = useRef<string>(value);

    const units: string[] = useMemo(() => {
        if ( type == "number" ) {
            return [''];
        }

        return supportedUnits ? supportedUnits : [''];
    },[supportedUnits, type]);

    const correctValue = useCallback( (value: number): number => {
        if (min) value = Math.max(min, value);
        if (max) value = Math.min(max, value);

        return value;
    },[max, min]);

    const validateValue = useCallback((valueUnit: ValueUnit): valueUnit is {value: number, unit: string} => {
        if ( !variableExists(valueUnit.value) ) {
            return false;
        }
        
        if ( !units.includes(valueUnit.unit) ) {
            return false;
        }

        return true;
    },[units]);

    function processValue( valueUnit: ValueUnit ): string {
        if ( !validateValue(valueUnit) ) {
            return currentValueRef.current;
        }

        const correctedValue = correctValue(valueUnit.value);
        return `${correctedValue}${valueUnit.unit}`;
    }

    const changeValue = useCallback((change: number) => {
        if (!inputRef.current) return;

        const valueStr = inputRef.current.value;
        if ( valueStr === '' ) {
            if (onInputChanged)
                onInputChanged(inputRef.current, change);
            return;
        }

        const valueUnit = separateValueAndUnit(valueStr);
        if ( !validateValue(valueUnit) ) {
            inputRef.current.value = currentValueRef.current;
            return;
        }
        
        valueUnit.value += change;
        const correctedValue = correctValue(valueUnit.value);
        const newValueStr = `${correctedValue}${valueUnit.unit}`;

        inputRef.current.value = newValueStr;
        if ( newValueStr != currentValueRef.current ) {
            currentValueRef.current = newValueStr;
            if ( onInputChanged)
                onInputChanged(inputRef.current, change);
        }
    },[correctValue, onInputChanged, validateValue]);

    function onAccept() {
        if (!inputRef.current) return;

        const valueStr = inputRef.current.value;
        const valueUnit = separateValueAndUnit(valueStr);
        const newValueStr = processValue(valueUnit);
        inputRef.current.value = newValueStr;

        currentValueRef.current = newValueStr;

        if ( onInputAccepted)
            onInputAccepted(inputRef.current);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if ( e.key == "Enter") {
            onAccept();
            e.preventDefault();
        }
    }

    function onBlur() {
        if ( !inputRef.current ) return;

        const valueStr = inputRef.current.value;
        const valueUnit = separateValueAndUnit(valueStr);
        const newValueStr = processValue(valueUnit);
        inputRef.current.value = newValueStr;
        currentValueRef.current = newValueStr;
    }

    const theme = useMemo(()=> {
        if ( variableExists(themeOverride) ) return themeOverride;
        return editorTheme.numberInputTheme;
    },[editorTheme.numberInputTheme, themeOverride]);

    function DecreaseIcon(props: IconBaseProps) {
        return theme.DecreaseIcon(props);
    }

    function IncreaseIcon(props: IconBaseProps) {
        return theme.IncreaseIcon(props);
    }

    function AcceptIcon(props: IconBaseProps) {
        return theme.AcceptIcon(props);
    }

    useEffect(()=>{
        if (!inputRef.current) return;
        inputRef.current.value = value;
        currentValueRef.current = value;
    },[value]);

    useEffect(()=>{
        function onWheel(event: WheelEvent) {
            event.preventDefault();
    
            if ( event.deltaY < 0 ) changeValue(+1);
            if ( event.deltaY > 0 ) changeValue(-1);
        }

        if (!inputRef.current) return;
        const inputElement = inputRef.current;
        
        inputElement.addEventListener('wheel', onWheel);
        return () => {
            inputElement.removeEventListener('wheel', onWheel);
        };
    },[inputRef, changeValue]);

    return (
        <div className={theme.container}>
            <DecreaseIcon className={theme.controlButton} onClick={() => { changeValue(-1); }} />
            <input ref={inputRef} className={theme.input} type={type} defaultValue={value} onKeyDown={onKeyDown} onBlur={onBlur}/>
            <IncreaseIcon className={theme.controlButton} onClick={() => { changeValue(1); }} />
            {useAcceptButton && (
                <>
                    <SeparatorVertical/>
                    <AcceptIcon className={theme.acceptButton} onClick={onAccept} />
                </>
            )}
        </div>
    );
}
