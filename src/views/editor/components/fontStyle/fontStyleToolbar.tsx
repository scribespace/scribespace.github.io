import { mergeRegister } from '@lexical/utils';
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToolbarContext } from "@editor/plugins/toolbarPlugin/context";
import { MenuItem } from "../menu";
import { CLEAR_FONT_STYLE_COMMAND } from '@src/views/editor/plugins/fontCommandsPlugin';
import { $menuItemParent } from '../menu/theme';

export default function FontStyleToolbar() {
    const {editor} = useToolbarContext();
    const {editorTheme}: MainTheme = useMainThemeContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const [fontStyleTheme, selectedItemTheme] = useMemo(()=> {
        return [editorTheme.fontStyleTheme, editorTheme.toolbarTheme.menuTheme.itemSelected];
    },[editorTheme.fontStyleTheme, editorTheme.toolbarTheme.menuTheme.itemSelected]);

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
        if ( editor ) {
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
        }
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
        editor.dispatchCommand(CLEAR_FONT_STYLE_COMMAND, undefined);
    };
    
    return (
        <>
            <div className={isBold ? selectedItemTheme : ''} style={$menuItemParent}>
                <MenuItem onClick={onClickBold}>
                    <fontStyleTheme.BoldIcon/>
                </MenuItem>
            </div>
            <div className={isItalic ? selectedItemTheme : ''} style={$menuItemParent}>
                <MenuItem onClick={onClickItalic}>
                    <fontStyleTheme.ItalicIcon/>
                </MenuItem>
            </div>
            <div className={isUnderline ? selectedItemTheme : ''} style={$menuItemParent}>
                <MenuItem onClick={onClickUnderline}>
                    <fontStyleTheme.UnderlineIcon/>
                </MenuItem>
            </div>
            <div className={isStrikethrough ? selectedItemTheme : ''} style={$menuItemParent}>
                <MenuItem onClick={onClickStrikethrough}>
                    <fontStyleTheme.StrikethroughIcon/>
                </MenuItem>
            </div>
            <MenuItem onClick={onClickClearFormatting}>
                <fontStyleTheme.ClearFormattingIcon/>
            </MenuItem>
        </>
    );
}