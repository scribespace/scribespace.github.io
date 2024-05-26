import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { separateValueAndUnit } from "@/utils/common";
import { DECREASE_FONT_SIZE_COMMAND, FONT_SIZE_CHANGED_COMMAND, INCREASE_FONT_SIZE_COMMAND, SET_FONT_SIZE_COMMAND } from "@/views/editor/plugins/fontPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { useEffect, useState } from "react";
import NumberInput from "../numberInput";

export default function FontSizeToolbar() {
    const [editor] = useLexicalComposerContext();
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