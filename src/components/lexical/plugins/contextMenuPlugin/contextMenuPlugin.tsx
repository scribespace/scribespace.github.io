import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContextMenu} from "./contextMenu";
import { createContext, useEffect, useState } from "react";
import TableContextOptions from "./options/tableContextOptions";
import { EditorThemeClassName } from "lexical";
import { variableExists } from "../../../../common";

export interface ContextMenuTheme {
    contextMenuFloat?: EditorThemeClassName;
    contextMenuContainer?: EditorThemeClassName;
    contextMenuItem?: EditorThemeClassName;
    contextMenuItemIcon?: EditorThemeClassName;
    contextMenuItemSubmenuIcon?: EditorThemeClassName;
    contextMenuSeparator?: EditorThemeClassName;
    contextMenuSeparatorStrong?: EditorThemeClassName;
}

const CONTEXT_MENU_DEFAULT_THEME: ContextMenuTheme = {
    contextMenuFloat: 'context-menu-float',
    contextMenuContainer: 'context-menu-container-default',
    contextMenuItem: 'context-menu-item-default',
    contextMenuItemIcon: 'context-menu-item-icon-default',
    contextMenuItemSubmenuIcon: 'context-menu-item-submenu-icon-default',
    contextMenuSeparator: 'context-menu-separator-default',
    contextMenuSeparatorStrong: 'context-menu-separator-strong-default',
}

interface ContextMenuPluginProps {
    theme?: ContextMenuTheme
}

export interface ContextMenuContextObject {
    theme: ContextMenuTheme;
    mousePosition: {x: number, y: number};
    closeContextMenu: () => void;
}
const NULL_CONTEXT_OBJECT = {theme: CONTEXT_MENU_DEFAULT_THEME, mousePosition: {x:-1, y:-1}, closeContextMenu: () => {}}
export const ContextMenuContext = createContext(NULL_CONTEXT_OBJECT)

export default function ContextMenuPlugin({theme}: ContextMenuPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextMenuContextObject, setContextMenuContextObject] = useState<ContextMenuContextObject>(NULL_CONTEXT_OBJECT);

    const openContextMenu = (e: MouseEvent) => {
        setShowContextMenu(true)
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, mousePosition: {x: (window.scrollX + e.clientX), y: (window.scrollY + e.clientY)}, closeContextMenu: oldState.closeContextMenu}})
        
        e.preventDefault()
        e.stopPropagation()
    }

    const closeContextMenu = () => {
        setShowContextMenu(false)
    }

    useEffect(()=>{
        let newContextMenuTheme: ContextMenuTheme = theme ? theme : {};
        for ( const field in CONTEXT_MENU_DEFAULT_THEME ) {
            if ( !variableExists((newContextMenuTheme as any)[field]) ) {
                (newContextMenuTheme as any)[field] = (CONTEXT_MENU_DEFAULT_THEME as any)[field]
            }
        }

        setContextMenuContextObject((oldState) => {return {theme: newContextMenuTheme, mousePosition: oldState.mousePosition, closeContextMenu: oldState.closeContextMenu}})
    },[theme])

    useEffect(()=>{
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, mousePosition: oldState.mousePosition, closeContextMenu: closeContextMenu}})

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
        <ContextMenuContext.Provider value={contextMenuContextObject}>
            <div>
                <ContextMenu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} position={{x: contextMenuContextObject.mousePosition.x, y: contextMenuContextObject.mousePosition.y}}>
                    <TableContextOptions editor={editor}/>
                </ContextMenu>
            </div>
        </ContextMenuContext.Provider>
    )
}