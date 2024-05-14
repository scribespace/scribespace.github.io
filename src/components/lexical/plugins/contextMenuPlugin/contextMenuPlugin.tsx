import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContextMenu} from "./contextMenu";
import { createContext, useEffect, useState } from "react";
import TableContextOptions from "./options/tableContextOptions";
import { EditorThemeClassName } from "lexical";
import { variableExists } from "../../../../common";

export class ContextMenuTheme {
    contextMenuContainer?: EditorThemeClassName = 'context-menu-container-default';
    contextMenuItem?: EditorThemeClassName = 'context-menu-item-default';
    contextMenuItemIcon?: EditorThemeClassName = 'context-menu-item-icon-default';
    contextMenuSeparator?: EditorThemeClassName = 'context-menu-separator-default';
}

interface ContextMenuPluginProps {
    theme?: ContextMenuTheme
}

export const ContextMenuContext = createContext(new ContextMenuTheme())

export default function ContextMenuPlugin({theme}: ContextMenuPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [mousePosition, setMousePosition] = useState<{x: number, y: number}>({x:-1, y:-1})
    const [contextMenuTheme, setContextMenuTheme] = useState<ContextMenuTheme>(new ContextMenuTheme());

    const openContextMenu = (e: MouseEvent) => {
        setMousePosition({x: (window.scrollX + e.clientX), y: (window.scrollY + e.clientY)})
        setShowContextMenu(true)
        
        e.preventDefault()
        e.stopPropagation()
    }

    useEffect(()=>{
            let newContextMenuTheme = theme ? theme : {};
            newContextMenuTheme.contextMenuContainer  = variableExists(newContextMenuTheme.contextMenuContainer)    ? newContextMenuTheme.contextMenuContainer    : 'context-menu-container-default'
            newContextMenuTheme.contextMenuItem       = variableExists(newContextMenuTheme.contextMenuItem)         ? newContextMenuTheme.contextMenuItem         : 'context-menu-item-default'
            newContextMenuTheme.contextMenuItemIcon   = variableExists(newContextMenuTheme.contextMenuItemIcon)     ? newContextMenuTheme.contextMenuItemIcon     : 'context-menu-item-icon-default'
            newContextMenuTheme.contextMenuSeparator  = variableExists(newContextMenuTheme.contextMenuSeparator)    ? newContextMenuTheme.contextMenuSeparator    : 'context-menu-separator-default'

            setContextMenuTheme(newContextMenuTheme)
    },[theme])

    useEffect(()=>{
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
        <ContextMenuContext.Provider value={contextMenuTheme}>
            <div>
                <ContextMenu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} position={{x: mousePosition.x, y:mousePosition.y}}>
                    <TableContextOptions/>
                    <TableContextOptions/>
                    <TableContextOptions/>
                    <TableContextOptions/>
                </ContextMenu>
            </div>
        </ContextMenuContext.Provider>
    )
}