import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'

import './css/editorToolbar.css'
import UndoRedoTool from './tools/undoRedoTool';
import StyleTool from './tools/styleTool';
import FontSizeTool from './tools/fontSizeTool';
import FontFamilyTool from './tools/fontFamilyTool';
import AlignTool from './tools/alignTool';
import ColorTools from './tools/colorTool';
import { forwardRef } from 'react';
import LinkTool from './tools/linkTool';

export const ToolbarPlugin = forwardRef<HTMLDivElement>(({}, ref) => {
    const [editor] = useLexicalComposerContext();

    function Separator() {
        return <div className='separator'/>
    }

    return (
        <div ref={ref} className='editor-toolbar'>
            <UndoRedoTool editor={editor}/>
            <Separator/>
            <StyleTool editor={editor}/>            
            <Separator/>
            <FontSizeTool editor={editor}/>
            <FontFamilyTool editor={editor}/>            
            <Separator/>
            <AlignTool editor={editor}/>
            <Separator/>
            <ColorTools editor={editor}/>
            <Separator/>
            <LinkTool editor={editor}/>
            <Separator/>
        </div>
    )
})