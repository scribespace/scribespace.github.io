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
                <TableCreateToolbar/>
            </div>
        </MenuRoot>
    );

    // return (
    //     <div ref={ref} className='editor-toolbar'>
    //         <ColorTools editor={editor}/>
    //         <Separator/>
    //         <LinkTool editor={editor}/>
    //         <Separator/>
    //         <TableCreateToolbar editor={editor}/>
    //         <Separator/>
    //     </div>
    // );
});

export default ToolbarPlugin;