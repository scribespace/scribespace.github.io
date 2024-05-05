import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'

import { ImUndo, ImRedo, ImBold, ImItalic, ImUnderline, ImStrikethrough, ImClearFormatting, ImMinus, ImPlus } from "react-icons/im";

import './css/editorToolbar.css'
import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, 
    CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, TextNode, UNDO_COMMAND } from 'lexical';
import {$patchStyleText, $getSelectionStyleValueForProperty} from '@lexical/selection'

import { KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import { CLEAR_FORMAT_TEXT_COMMAND, INCREASE_FONT_SIZE_COMMAND, DECREASE_FONT_SIZE_COMMAND, SET_FONT_SIZE_COMMAND, FONT_SIZE_CHANGED } from '../commands';

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const defaultFontSize = useRef<string>('')

    function Separator() {
        return <div className='separator'/>
    }

    function UndoRedoTool() {
        const [canUndo, setCanUndo] = useState<boolean>(false)
        const [canRedo, setCanRedo] = useState<boolean>(false)

        useEffect(() => {

            const removeUndoCommand = editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                setCanUndo(payload);
                return false;
                },
                COMMAND_PRIORITY_LOW
            )

            const removeRedoCommand = editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                setCanRedo(payload);
                return false;
                },
                COMMAND_PRIORITY_LOW
            )
            return () => {removeUndoCommand(); removeRedoCommand();}
        }, [])

        const onClickUndo = () => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
        }

        const onClickRedo = () => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
        }

        return (
            <div>
                <ImUndo className={'item' + (canUndo ? '' : ' disabled')} onClick={onClickUndo}/>
                <ImRedo className={'item' + (canRedo ? '' : ' disabled')} onClick={onClickRedo}/>
            </div>
        )
    }

    function StyleTool() {
        const [isBold, setIsBold] = useState(false);
        const [isItalic, setIsItalic] = useState(false);
        const [isUnderline, setIsUnderline] = useState(false);
        const [isStrikethrough, setIsStrikethrough] = useState(false);

        const updateStates = useCallback(() => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection) ) {
                setIsBold(selection.hasFormat("bold"));
                setIsItalic(selection.hasFormat("italic"));
                setIsUnderline(selection.hasFormat("underline"));
                setIsStrikethrough(selection.hasFormat("strikethrough"));
            }
        }, [])

        useEffect(() => {
            const removeSelectionChanage = editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateStates();
                  return false;
                },
                COMMAND_PRIORITY_LOW
              )
             return () => {removeSelectionChanage()}
        }, [])

        const onClickBold = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }

        const onClickItalic = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }

        const onClickUnderline = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }

        const onClickStrikethrough = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }

        const onClickClearFormatting = () => {
            editor.dispatchCommand(CLEAR_FORMAT_TEXT_COMMAND, undefined);
        }

        return (
            <div>
                <ImBold className={'item' + (isBold ? " selected" : "")} onClick={onClickBold}/>
                <ImItalic className={'item' + (isItalic ? " selected" : "")} onClick={onClickItalic}/>
                <ImUnderline className={'item' + (isUnderline ? " selected" : "")} onClick={onClickUnderline}/>
                <ImStrikethrough className={'item' + (isStrikethrough ? " selected" : "")} onClick={onClickStrikethrough}/>
                <ImClearFormatting className='item' onClick={onClickClearFormatting}/>
            </div>
        )
    }

    function FontSizeTool() {
        const fontInputRef = useRef<HTMLInputElement>(null)

        const updateStates = useCallback(() => {
            const selection = $getSelection();
            if ( $isRangeSelection(selection) ) {
                if ( fontInputRef.current )
                    fontInputRef.current.value = ($getSelectionStyleValueForProperty(selection, 'font-size', defaultFontSize.current))
            }
        }, [])

        useEffect(() => {
            const removeSelectionChanage = editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateStates();
                  return false;
                },
                COMMAND_PRIORITY_LOW
              )
              const removeFontSizeChanage = editor.registerCommand(
                FONT_SIZE_CHANGED,
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
            <div>
                <ImMinus className='item item-font-size-button' onClick={onClickFontSizeDecrease}/>
                <input ref={fontInputRef} className='item-font-size' type='text' defaultValue={''} onKeyDown={onKeyDownFontSize}/>
                <ImPlus className='item item-font-size-button' onClick={onClickFontSizeIncrease}/>
            </div>
        )
    }

    useEffect(() =>{ 
        defaultFontSize.current = getComputedStyle(document.documentElement).getPropertyValue("--default-font-size");
    }, [])

    return (
        <div className='editor-toolbar'>
            <UndoRedoTool/>
            <Separator/>
            <StyleTool/>
            <Separator/>
            <FontSizeTool/>
            <Separator/>
        </div>
    )
}