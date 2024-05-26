
import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import FontStyleToolbar from '@/views/editor/components/fontStyle/fontStyleToolbar';
import UndoRedoToolbar from '@/views/editor/components/undoRedo/undoRedoToolbar';
import { SeparatorVertical } from '@editor/components/separators';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import AlignToolbar from '../../components/align/alignToolbar';
import { ColorBackgroundToolbar, ColorTextToolbar } from '../../components/color';
import FontFamilyToolbar from '../../components/fontFamily/fontFamilyToolbar';
import FontSizeToolbar from '../../components/fontSize/fontSizeToolbar';
import { LinkToolbar } from '../../components/link';
import { MenuRoot } from '../../components/menu';
import { LayoutCreateToolbar } from '../../components/tableLayout/layout';
import { TableCreateToolbar } from '../../components/tableLayout/table/toolbar/tableCreateToolbar';
import { TOOLBAR_CONTEX_DEFAULT, ToolbarContextData } from './context';
import './css/toolbarPlugin.css';

const ToolbarPlugin = forwardRef<HTMLDivElement>((_, ref) => {
    const { editorTheme } : MainTheme = useMainThemeContext();

    const [toolbarContext, setToolbarContext] = useState<ToolbarContextData>(TOOLBAR_CONTEX_DEFAULT);

    const toolbarTheme = useMemo(() => {
        return editorTheme.toolbarTheme;
    }, [editorTheme.toolbarTheme]);

    useEffect(() => {
        setToolbarContext( (oldState) => ({...oldState, theme: toolbarTheme.menuTheme}) );
    },[toolbarTheme.menuTheme]);

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