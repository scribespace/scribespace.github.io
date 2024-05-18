import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContextMenu} from "./contextMenu";
import { createContext, useEffect, useReducer, useRef, useState } from "react";
import TableContextOptions from "./options/tableContextOptions";
import { EditorThemeClassName } from "lexical";
import { copyExistingValues } from "../../../../common";
import { IconType } from "react-icons";
import { FaAngleRight } from "react-icons/fa";

export interface ContextMenuIcons {
    SubmenuIcon: IconType;
}

const CONTEXT_MENU_DEFAULT_ICONS: ContextMenuIcons = {
    SubmenuIcon: FaAngleRight,
}

export interface ContextMenuTheme {
    contextMenuFloat?: EditorThemeClassName;
    contextMenuContainer?: EditorThemeClassName;
    contextMenuItem?: EditorThemeClassName;
    contextMenuItemIcon?: EditorThemeClassName;
    contextMenuItemSubmenuIcon?: EditorThemeClassName;
    contextMenuEditorContainer?: EditorThemeClassName;
    contextMenuEditorButton?: EditorThemeClassName;
}

const CONTEXT_MENU_DEFAULT_THEME: ContextMenuTheme = {
    contextMenuFloat: 'context-menu-float',
    contextMenuContainer: 'context-menu-container-default',
    contextMenuItem: 'context-menu-item-default',
    contextMenuItemIcon: 'context-menu-item-icon-default',
    contextMenuItemSubmenuIcon: 'context-menu-item-submenu-icon-default',
    contextMenuEditorContainer: 'context-menu-editor-container-default',
    contextMenuEditorButton: 'context-menu-editor-button-default',
}

interface ContextMenuPluginProps {
    theme?: ContextMenuTheme;
    icons?: Partial<ContextMenuIcons>;
}

export interface ContextMenuContextObject {
    theme: ContextMenuTheme;
    icons: ContextMenuIcons;
    mousePosition: {x: number, y: number};
    closeContextMenu: () => void;
}
const NULL_CONTEXT_OBJECT = {theme: CONTEXT_MENU_DEFAULT_THEME, icons: CONTEXT_MENU_DEFAULT_ICONS, mousePosition: {x:-1, y:-1}, closeContextMenu: () => {}}
export const ContextMenuContext = createContext(NULL_CONTEXT_OBJECT)

export default function ContextMenuPlugin({theme, icons}: ContextMenuPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextMenuContextObject, setContextMenuContextObject] = useState<ContextMenuContextObject>(NULL_CONTEXT_OBJECT);

    const openContextMenu = (e: MouseEvent) => {
        setShowContextMenu(true)
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: oldState.icons, mousePosition: {x: (window.scrollX + e.clientX), y: (window.scrollY + e.clientY)}, closeContextMenu: oldState.closeContextMenu}})
        
        e.preventDefault()
        e.stopPropagation()
    }

    const closeContextMenu = () => {
        setShowContextMenu(false)
    }

    useEffect(()=>{
        const newTheme = copyExistingValues(theme, CONTEXT_MENU_DEFAULT_THEME);
        setContextMenuContextObject((oldState) => {return {theme: newTheme, icons: oldState.icons, mousePosition: oldState.mousePosition, closeContextMenu: oldState.closeContextMenu}})
    },[theme])

    useEffect(()=>{
        const newIcons = copyExistingValues(icons, CONTEXT_MENU_DEFAULT_ICONS);
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: newIcons, mousePosition: oldState.mousePosition, closeContextMenu: oldState.closeContextMenu}})
    },[icons])

    useEffect(()=>{
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: oldState.icons, mousePosition: oldState.mousePosition, closeContextMenu: closeContextMenu}})

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