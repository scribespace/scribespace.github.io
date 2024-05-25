import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import './css/toolbarPlugin.css';
import TableCreateToolbar from '@/views/editor/components/table/toolbar/tableCreateToolbar';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useMainThemeContext } from '@/mainThemeContext';
import { MainTheme } from '@/theme';
import { MenuContext } from '@/views/editor/components/menu/menuContext';
import { TOOLBAR_CONTEX_DEFAULT, ToolbarContextData } from './context';
import UndoRedoToolbar from '@/views/editor/components/undoRedo/undoRedoToolbar';
import { SeparatorVertical } from '@editor/components/separators';
import FontStyleToolbar from '@/views/editor/components/fontStyle/fontStyleToolbar';
import FontSizeToolbar from '../../components/fontSize/fontSizeToolbar';
import FontFamilyToolbar from '../../components/fontFamily/fontFamilyToolbar';

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
        <MenuContext.Provider value={toolbarContext}>
        <div ref={ref} className={toolbarTheme.container}>
            <UndoRedoToolbar/>
                <SeparatorVertical/>
            <FontStyleToolbar/>
                <SeparatorVertical/>
            <FontSizeToolbar/>
            <FontFamilyToolbar/>
                <SeparatorVertical/>
            <TableCreateToolbar/>
        </div>
        </MenuContext.Provider>
    );

    // return (
    //     <div ref={ref} className='editor-toolbar'>
    //         <FontFamilyTool editor={editor}/>            
    //         <Separator/>
    //         <AlignTool editor={editor}/>
    //         <Separator/>
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