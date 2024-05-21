import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND } from "lexical";
import { mergeRegister } from '@lexical/utils';
import { useState, useCallback, useEffect } from "react";
import { ImBold, ImItalic, ImUnderline, ImStrikethrough, ImClearFormatting } from "react-icons/im";
import { CLEAR_FORMAT_TEXT_COMMAND } from "../../../commands";
import { ToolbarToolProps } from "./toolsProps";

export default function StyleTool({editor}: ToolbarToolProps) {
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
        }, []);

        useEffect(() => {
            return mergeRegister(
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    () => {
                        updateStates();
                      return false;
                    },
                    COMMAND_PRIORITY_LOW
                  ),
                  editor.registerUpdateListener(({ editorState }) => {
                    editorState.read(() => {
                        updateStates();
                    });
                  }),
            );
        }, [editor, updateStates]);

        const onClickBold = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        };

        const onClickItalic = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        };

        const onClickUnderline = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        };

        const onClickStrikethrough = () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        };

        const onClickClearFormatting = () => {
            editor.dispatchCommand(CLEAR_FORMAT_TEXT_COMMAND, undefined);
        };
        
        return (
            <div>
                <ImBold className={'item' + (isBold ? " selected" : "")} onClick={onClickBold}/>
                <ImItalic className={'item' + (isItalic ? " selected" : "")} onClick={onClickItalic}/>
                <ImUnderline className={'item' + (isUnderline ? " selected" : "")} onClick={onClickUnderline}/>
                <ImStrikethrough className={'item' + (isStrikethrough ? " selected" : "")} onClick={onClickStrikethrough}/>
                <ImClearFormatting className='item' onClick={onClickClearFormatting}/>
            </div>
        );
    }