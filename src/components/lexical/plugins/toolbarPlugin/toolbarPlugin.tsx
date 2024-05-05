import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'

import './css/editorToolbar.css'
import UndoRedoTool from './tools/undoRedoTool';
import StyleTool from './tools/styleTool';
import FontSizeTool from './tools/fontSizeTool';
import FontFamilyTool from './tools/fontFamilyTool';
import AlignTool from './tools/alignTool';

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    function Separator() {
        return <div className='separator'/>
    }

    return (
        <div className='editor-toolbar'>
            <UndoRedoTool editor={editor}/>
            <Separator/>
            <StyleTool editor={editor}/>            
            <Separator/>
            <FontSizeTool editor={editor}/>
            <FontFamilyTool editor={editor}/>            
            <Separator/>
            <AlignTool editor={editor}/>
        </div>
    )
}