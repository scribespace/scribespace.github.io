import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { TableContextOptions } from "@editor/components/table";
import './css/contextMenuPlugin.css';
import { ContextMenuContextData, CONTEXT_MENU_CONTEX_DEFAULT } from "./context";
import { MenuContext } from "@editor/components/menu/context";
import { Menu } from "@editor/components/menu";
import { useMainThemeContext } from "@src/mainThemeContext";
import { MainTheme } from "@src/theme";

export default function ContextMenuPlugin() {
    const { editorTheme }: MainTheme = useMainThemeContext();
    const [editor] = useLexicalComposerContext();

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [contextMenuContextObject, setContextMenuContextObject] = useState<ContextMenuContextData>(CONTEXT_MENU_CONTEX_DEFAULT);

    const openContextMenu = (e: MouseEvent) => {
        setShowContextMenu(true);
        setContextMenuContextObject((oldState) => ({...oldState, mousePosition: {x: e.clientX, y: e.clientY}}));
        
        e.preventDefault();
        e.stopPropagation();
    };

    const closeContextMenu = () => {
        setShowContextMenu(false);
    };

    useEffect(()=>{        
        setContextMenuContextObject((oldState) => ({...oldState, theme: editorTheme?.contextMenuTheme?.menuTheme}) );
    },[editorTheme?.contextMenuTheme?.menuTheme]);

    useEffect(()=>{
        setContextMenuContextObject((oldState) => ( {...oldState, closeMenu: closeContextMenu}));

        const removeRootListeners = editor.registerRootListener((rootElement, prevElement) => {
            if (rootElement !== null) {
                rootElement.addEventListener('contextmenu', openContextMenu);
            }
            if (prevElement !== null) {
                prevElement.removeEventListener('contextmenu', openContextMenu);
            }
            });

            return () => {
                removeRootListeners();
            };
    },[editor]);

    return (
        <MenuContext.Provider value={contextMenuContextObject}>
            <div>
                <Menu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} parentRect={{x: contextMenuContextObject.mousePosition.x, y: contextMenuContextObject.mousePosition.y, width: 0, height: 0}}>
                    <TableContextOptions editor={editor}/>
                </Menu>
            </div>
        </MenuContext.Provider>
    );
}