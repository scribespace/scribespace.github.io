import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContextMenu} from "./contextMenu";
import { createContext, useEffect, useState } from "react";
import TableContextOptions from "./options/tableContextOptions";
import { EditorThemeClassName } from "lexical";
import { variableExists } from "../../../../common";

export class ContextMenuTheme {
    contextMenuFloat?: EditorThemeClassName = 'context-menu-float';
    contextMenuContainer?: EditorThemeClassName = 'context-menu-container-default';
    contextMenuItem?: EditorThemeClassName = 'context-menu-item-default';
    contextMenuItemIcon?: EditorThemeClassName = 'context-menu-item-icon-default';
    contextMenuItemSubmenuIcon?: EditorThemeClassName = 'context-menu-item-submenu-icon-default';
    contextMenuSeparator?: EditorThemeClassName = 'context-menu-separator-default';
}

interface ContextMenuPluginProps {
    theme?: ContextMenuTheme
}

export interface ContextMenuContextObject {
    theme: ContextMenuTheme;
    mousePosition: {x: number, y: number};
    closeContextMenu: () => void;
}
const NULL_CONTEXT_OBJECT = {theme: new ContextMenuTheme(), mousePosition: {x:-1, y:-1}, closeContextMenu: () => {}}
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
            let newContextMenuTheme = theme ? theme : {};
            newContextMenuTheme.contextMenuFloat            = variableExists(newContextMenuTheme.contextMenuFloat)              ? newContextMenuTheme.contextMenuFloat              : 'context-menu-float'
            newContextMenuTheme.contextMenuContainer        = variableExists(newContextMenuTheme.contextMenuContainer)          ? newContextMenuTheme.contextMenuContainer          : 'context-menu-container-default'
            newContextMenuTheme.contextMenuItem             = variableExists(newContextMenuTheme.contextMenuItem)               ? newContextMenuTheme.contextMenuItem               : 'context-menu-item-default'
            newContextMenuTheme.contextMenuItemIcon         = variableExists(newContextMenuTheme.contextMenuItemIcon)           ? newContextMenuTheme.contextMenuItemIcon           : 'context-menu-item-icon-default'
            newContextMenuTheme.contextMenuItemSubmenuIcon  = variableExists(newContextMenuTheme.contextMenuItemSubmenuIcon)    ? newContextMenuTheme.contextMenuItemSubmenuIcon    : 'context-menu-item-submenu-icon-default'
            newContextMenuTheme.contextMenuSeparator        = variableExists(newContextMenuTheme.contextMenuSeparator)          ? newContextMenuTheme.contextMenuSeparator          : 'context-menu-separator-default'

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