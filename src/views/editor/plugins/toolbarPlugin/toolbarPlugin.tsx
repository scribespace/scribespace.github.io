import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import './css/toolbarPlugin.css';
//import UndoRedoTool from '../../components/undoRedo/undoRedo';
//import StyleTool from './tools/styleTool';
//import FontSizeTool from './tools/fontSizeTool';
//import FontFamilyTool from './tools/fontFamilyTool';
//import AlignTool from './tools/alignTool';
//import ColorTools from './tools/colorTool';
//import LinkTool from './tools/linkTool';
import TableCreateToolbar from '../../components/table/toolbar/tableCreate';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useMainThemeContext } from '@src/mainThemeContext';
import { MainTheme } from '@src/theme';
import { MenuContext } from '@editor/components/menu/context';
import { TOOLBAR_CONTEX_DEFAULT, ToolbarContextData } from './context';
import UndoRedoToolbar from '../../components/undoRedo/undoRedo';
import { SeparatorVertical } from '../../components/separators';
import TextStyleToolbar from '../../components/textStyle/textStyle';

export const ToolbarPlugin = forwardRef<HTMLDivElement>((_, ref) => {
    const [editor] = useLexicalComposerContext();
    const { editorTheme } : MainTheme = useMainThemeContext();

    const [toolbarContext, setToolbarContext] = useState<ToolbarContextData>(TOOLBAR_CONTEX_DEFAULT);

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
            <TextStyleToolbar/>
            <SeparatorVertical/>
            <TableCreateToolbar/>
        </div>
        </MenuContext.Provider>
    );

    // return (
    //     <div ref={ref} className='editor-toolbar'>
    //         <UndoRedoTool editor={editor}/>
    //         <Separator/>
    //         <StyleTool editor={editor}/>            
    //         <Separator/>
    //         <FontSizeTool editor={editor}/>
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