import { variableExists } from "@/utils";
import { assert } from "@/utils/dev";
import { EditorThemeClassName } from "lexical";
import { Children, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Menu from "./menu";
import { MenuContextData, useMenuContext } from "./menuContext";
import MenuItem from "./menuItem";
import { $menuItemParent } from "./theme";

interface SubmenuProps {
    className?: EditorThemeClassName;
    showSubmenu?: boolean
    setShowSubmenu?: (show:boolean) => void;
    children: React.ReactNode;
}

export default function Submenu({ className, showSubmenu, setShowSubmenu, children }: SubmenuProps) {
    const menuContext: MenuContextData = useMenuContext();    
    const showMenuInternal = useState<boolean>(false);
    const [rect, setRect] = useState<{x: number, y: number, width: number, height: number}>({x: -1, y: -1, width: 0, height: 0});
    const menuOptionRef = useRef<HTMLDivElement>(null);
    
    const theme = useMemo(() => {
        return menuContext.theme;
    },[menuContext.theme]);

    const [showMenu, setShowMenu] = useMemo(
        () => {
            if ( variableExists( showSubmenu ) && setShowSubmenu ) {
                return [showSubmenu, setShowSubmenu];
            }
            return showMenuInternal;
        },
        [setShowSubmenu, showSubmenu, showMenuInternal]
    );


    const [menuItem, processedChildren] = useMemo(() => {
        const childrenArray = Children.toArray(children) as ReactElement[];
        assert(childrenArray[0]?.type === MenuItem, `Submenu: First child has to be SubmenuItem (${childrenArray[0]?.type})`);
        return [
            childrenArray[0],
            childrenArray.slice(1)
        ];
    },[children]);

    useEffect(()=>{
        const menuOption = menuOptionRef.current;
        if ( menuOption != null ){
            const { left, top, width, height } = menuOption.getBoundingClientRect();
            const rect = {x: left, y: top, width, height};
            setRect(rect);
        } 
    },[]);

    useEffect(() => {
        const stopRightClick = () => {
            setShowMenu(false);
        };

        document.addEventListener('contextmenu', stopRightClick);

        return () => {
            document.removeEventListener('contextmenu', stopRightClick);
        };
    }, [setShowMenu]);

    function onClick() {
        setShowMenu(true);
    }
    
    return (
        <div style={{position: 'relative'}}>
            <div ref={menuOptionRef} className={showMenu ? theme.itemSelected : ''} style={$menuItemParent} onClick={onClick}>
                {menuItem}
            </div>
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} parentRect={rect} className={className}>
                {processedChildren}
            </Menu>
        </div>
    );
}