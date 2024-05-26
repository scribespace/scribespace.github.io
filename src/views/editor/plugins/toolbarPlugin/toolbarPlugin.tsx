import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import FontStyleToolbar from '@/views/editor/components/fontStyle/fontStyleToolbar';
import TableCreateToolbar from '@/views/editor/components/table/toolbar/tableCreateToolbar';
import UndoRedoToolbar from '@/views/editor/components/undoRedo/undoRedoToolbar';
import { SeparatorVertical } from '@editor/components/separators';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import FontFamilyToolbar from '../../components/fontFamily/fontFamilyToolbar';
import FontSizeToolbar from '../../components/fontSize/fontSizeToolbar';
import { MenuRoot } from '../../components/menu';
import { TOOLBAR_CONTEX_DEFAULT, ToolbarContextData } from './context';
import './css/toolbarPlugin.css';
import AlignToolbar from '../../components/align/alignToolbar';
import { ColorBackgroundToolbar, ColorTextToolbar } from '../../components/color';
import { LinkToolbar } from '../../components/link';
import { LayoutCreateToolbar } from '../../components/layout';

const ToolbarPlugin = forwardRef<HTMLDivElement>((_, ref) => {
    const [editor] = useLexicalComposerContext();
    const { editorTheme } : MainTheme = useMainThemeContext();

    const [toolbarContext, setToolbarContext] = useState<ToolbarContextData>({...TOOLBAR_CONTEX_DEFAULT, editor});

    const toolbarTheme = useMemo(() => {
        return editorTheme.toolbarTheme;
    }, [editorTheme.toolbarTheme]);

    useEffect(() => {
        setToolbarContext( (oldState) => ({...oldState, theme: toolbarTheme.menuTheme}) );
    },[toolbarTheme.menuTheme]);

    useEffect(() => {
        setToolbarContext( (oldState) => ({...oldState, editor}) );
    },[editor]);

    return (
        <MenuRoot value={toolbarContext}>
            <div ref={ref} className={toolbarTheme.container}>
                <UndoRedoToolbar/>
                    <SeparatorVertical/>
                <FontStyleToolbar/>
                    <SeparatorVertical/>
                <FontSizeToolbar/>
                <FontFamilyToolbar/>
                    <SeparatorVertical/>
                <AlignToolbar/>
                    <SeparatorVertical/>
                <ColorTextToolbar/>
                <ColorBackgroundToolbar/>
                    <SeparatorVertical/>
                <LinkToolbar/>
                    <SeparatorVertical/>
                <LayoutCreateToolbar/>
                <TableCreateToolbar/>
            </div>
        </MenuRoot>
    );
});

export default ToolbarPlugin;