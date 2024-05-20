import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Menu, MenuContext, MenuContextData, MenuIcons, MenuTheme } from "../../components/menu/menu";
import { useEffect, useState } from "react";
import TableContextOptions from "../../components/table/tableContextOptions";
import { EditorThemeClassName } from "lexical";
import { copyExistingValues } from "../../../../common";
import { FaAngleRight } from "react-icons/fa";
import { TableMenuIcons, TABLE_MENU_DEFAULT_ICONS } from "../../components/table/tableIcons";
import './css/contextMenuPlugin.css';

export interface ContextMenuIcons extends MenuIcons {
    tableIcons: TableMenuIcons,
}

const CONTEXT_MENU_DEFAULT_ICONS: ContextMenuIcons = {
    SubmenuIcon: FaAngleRight,
    tableIcons: TABLE_MENU_DEFAULT_ICONS
}

export interface ContextMenuTheme extends MenuTheme {
    contextMenuEditorContainer?: EditorThemeClassName;
}

const CONTEXT_MENU_DEFAULT_THEME: ContextMenuTheme = {
    menuFloat: 'context-menu-float',
    menuContainer: 'context-menu-container-default',
    menuItem: 'context-menu-item-default',
    menuItemIcon: 'context-menu-item-icon-default',
    menuItemSubmenuIcon: 'context-menu-item-submenu-icon-default',
    contextMenuEditorContainer: 'context-menu-editor-container-default',
}

interface ContextMenuPluginProps {
    theme?: ContextMenuTheme;
    icons?: Partial<ContextMenuIcons>;
}

export interface ContextMenuContextData extends MenuContextData {
    theme: ContextMenuTheme;
    icons: ContextMenuIcons;
    mousePosition: {x: number, y: number};
    closeMenu: () => void;
}

const NULL_CONTEXT_OBJECT = {theme: CONTEXT_MENU_DEFAULT_THEME, icons: CONTEXT_MENU_DEFAULT_ICONS, mousePosition: {x:-1, y:-1}, closeMenu: () => {}} as ContextMenuContextData;

export default function ContextMenuPlugin({theme, icons}: ContextMenuPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextMenuContextObject, setContextMenuContextObject] = useState<ContextMenuContextData>(NULL_CONTEXT_OBJECT);

    const openContextMenu = (e: MouseEvent) => {
        setShowContextMenu(true)
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: oldState.icons, mousePosition: {x: e.clientX, y: e.clientY}, closeMenu: oldState.closeMenu}})
        
        e.preventDefault()
        e.stopPropagation()
    }

    const closeContextMenu = () => {
        setShowContextMenu(false)
    }

    useEffect(()=>{
        const newTheme = copyExistingValues(theme, CONTEXT_MENU_DEFAULT_THEME);
        setContextMenuContextObject((oldState) => {return {theme: newTheme, icons: oldState.icons, mousePosition: oldState.mousePosition, closeMenu: oldState.closeMenu}})
    },[theme])

    useEffect(()=>{
        const newIcons = copyExistingValues(icons, CONTEXT_MENU_DEFAULT_ICONS);
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: newIcons, mousePosition: oldState.mousePosition, closeMenu: oldState.closeMenu}})
    },[icons])

    useEffect(()=>{
        setContextMenuContextObject((oldState) => {return {theme: oldState.theme, icons: oldState.icons, mousePosition: oldState.mousePosition, closeMenu: closeContextMenu}})

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