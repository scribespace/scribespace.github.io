import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import {$getSelectionStyleValueForProperty} from '@lexical/selection'
import { useRef, useCallback, useEffect } from "react";
import { ImMinus, ImPlus } from "react-icons/im";
import { FONT_SIZE_CHANGED_COMMAND, INCREASE_FONT_SIZE_COMMAND, DECREASE_FONT_SIZE_COMMAND, SET_FONT_SIZE_COMMAND } from "../../../commands";
import { ToolbarToolProps } from "./toolsProps";

export default function FontSizeTool({editor}: ToolbarToolProps) {
        const fontInputRef = useRef<HTMLInputElement>(null)
        const defaultFontSize = useRef<string>('')

        const updateStates = useCallback(() => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection) ) {
                if ( fontInputRef.current )
                    fontInputRef.current.value = ($getSelectionStyleValueForProperty(selection, 'font-size', defaultFontSize.current))
            }
        }, [])

        useEffect(() => {
            defaultFontSize.current = getComputedStyle(document.documentElement).getPropertyValue("--default-font-size");

            const removeSelectionChanage = editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateStates();
                  return false;
                },
                COMMAND_PRIORITY_LOW
              )
              const removeFontSizeChanage = editor.registerCommand(
                FONT_SIZE_CHANGED_COMMAND,
                () => {
                    updateStates();
                  return false;
                },
                COMMAND_PRIORITY_LOW
              )
              return () => {removeSelectionChanage(); removeFontSizeChanage()}
        }, [])

        const onClickFontSizeIncrease = () => {
            editor.dispatchCommand(INCREASE_FONT_SIZE_COMMAND, undefined);
        }

        const onClickFontSizeDecrease = () => {
            editor.dispatchCommand(DECREASE_FONT_SIZE_COMMAND, undefined);
        }

        const onKeyDownFontSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if ( e.key == "Enter") {
                if ( fontInputRef.current ) {
                    let size = fontInputRef.current.value.match(/\d+/g);
                    const unit = fontInputRef.current.value.match(/[a-zA-Z]+/g);

                    const supportedUnits = [
                        'pt',
                        'px',
                        'mm'
                    ]
                    const validFont = size && unit && supportedUnits.includes(unit[0]);
                    
                    if ( validFont )
                        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, fontInputRef.current.value)
                    
                    e.preventDefault();
                }
            }
        }
        
        return (
            <div style={{alignContent: 'center'}}>
                <ImMinus className='item item-font-size-button' onClick={onClickFontSizeDecrease}/>
                <input ref={fontInputRef} className='item-font-size' type='text' defaultValue={''} onKeyDown={onKeyDownFontSize}/>
                <ImPlus className='item item-font-size-button' onClick={onClickFontSizeIncrease}/>
            </div>
        )
    }