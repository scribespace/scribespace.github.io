import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Menu, MenuContext } from "../../components/menu/menu";
import { useContext, useEffect, useState } from "react";
import TableContextOptions from "../../components/table/tableContextOptions";
import './css/contextMenuPlugin.css';
import { ContextMenuContextData, CONTEXT_MENU_CONTEX_DEFAULT } from "./contextMenuContext";
import { EditorTheme, EditorThemeContext } from "../../editorThemeContext";

export default function ContextMenuPlugin() {
    const editorTheme: EditorTheme = useContext(EditorThemeContext)
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextMenuContextObject, setContextMenuContextObject] = useState<ContextMenuContextData>(CONTEXT_MENU_CONTEX_DEFAULT);

    const openContextMenu = (e: MouseEvent) => {
        setShowContextMenu(true)
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, mousePosition: {x: e.clientX, y: e.clientY}, closeMenu: oldState.closeMenu}})
        
        e.preventDefault()
        e.stopPropagation()
    }

    const closeContextMenu = () => {
        setShowContextMenu(false)
    }

    useEffect(()=>{
        setContextMenuContextObject((oldState) => {return {theme: editorTheme.contextMenuTheme, mousePosition: oldState.mousePosition, closeMenu: oldState.closeMenu}})
    },[editorTheme])

    useEffect(()=>{
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, mousePosition: oldState.mousePosition, closeMenu: closeContextMenu}})

        const removeRootListeners = editor.registerRootListener((rootElement, prevElement) => {
            if (rootElement !== null) {
                rootElement.addEventListener('contextmenu', openContextMenu);
            }
            if (prevElement !== null) {
                prevElement.removeEventListener('contextmenu', openContextMenu);
            }
            })

            return () => {
                removeRootListeners()
            }
    },[])

    return (
        <MenuContext.Provider value={contextMenuContextObject}>
            <div>
                <Menu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} parentRect={{x: contextMenuContextObject.mousePosition.x, y: contextMenuContextObject.mousePosition.y, width: 0, height: 0}}>
                    <TableContextOptions editor={editor}/>
                </Menu>
            </div>
        </MenuContext.Provider>
    )
}