import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from "@lexical/utils";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { separateValueAndUnit } from "@src/utils/common";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import NumberInput from "../numberInput";
import { DECREASE_FONT_SIZE_COMMAND, FONT_SIZE_CHANGED_COMMAND, INCREASE_FONT_SIZE_COMMAND, SET_FONT_SIZE_COMMAND } from "@editor/plugins/fontCommandsPlugin";

export default function FontSizeToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme:{editorInputTheme:{defaultFontSize}}}: MainTheme = useMainThemeContext();
    const [fontSize, setFontSize] = useState<string>(defaultFontSize);

    useEffect(() => {
        function updateStates() {
            const selection = $getSelection();
            if ( $isRangeSelection(selection) ) 
                setFontSize( $getSelectionStyleValueForProperty(selection, 'font-size', defaultFontSize) );
        }

        return mergeRegister(
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateStates();
                return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                FONT_SIZE_CHANGED_COMMAND,
                () => {
                    updateStates();
                return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [defaultFontSize, editor]);

    const onChange = ( _: HTMLInputElement, change: number ) => {
        if ( change == -1 ) {
            editor.dispatchCommand(DECREASE_FONT_SIZE_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INCREASE_FONT_SIZE_COMMAND, undefined);
        }
    };

    const onInputAccepted = (target: HTMLInputElement) => {
        const valueUnit = separateValueAndUnit(target.value);
        valueUnit.unit = valueUnit.unit == '' ? 'pt' : valueUnit.unit;
        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, `${valueUnit.value}${valueUnit.unit}`);                            
    };
    
    return <NumberInput type="text" supportedUnits={['', 'pt', 'px', 'mm']} value={fontSize} min={0} onInputChanged={onChange} onInputAccepted={onInputAccepted} />;
}