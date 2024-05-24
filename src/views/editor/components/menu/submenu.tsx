import { useEffect, useRef, useState, Children, useMemo, ReactElement } from "react";
import Menu from "./menu";
import { assert, variableExistsOrThrowDev } from "@src/utils/common";
import MenuItem from "./menuItem";
import { MenuContextData, useMenuContext } from "./context";

interface SubmenuProps {
    disableBackground?: boolean;
    disableSubmenuIcon?: boolean;
    children: React.ReactNode;
}

export default function Submenu(props: SubmenuProps) {
    const menuContext: MenuContextData = useMenuContext();

    const theme = useMemo(() => {
        variableExistsOrThrowDev(menuContext.theme);
        return menuContext.theme;
    },[menuContext.theme]);

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

    const menuOptionRef = useRef<HTMLDivElement>(null);
    const [rect, setRect] = useState<{x: number, y: number, width: number, height: number}>({x: -1, y: -1, width: 0, height: 0});

    const [menuItem, children] = useMemo(() => {
        const childrenArray = Children.toArray(props.children) as ReactElement[];
        assert(childrenArray[0]?.type === MenuItem, `Submenu: First child has to be SubmenuItem (${childrenArray[0]?.type})`);
        return [
            childrenArray[0],
            childrenArray.slice(1)
        ];
    },[props.children]);

    useEffect(()=>{
        setShowContextMenu(false);
    },[menuItem]);
    
    useEffect(()=>{
        const menuOption = menuOptionRef.current;
        if ( menuOption != null ){
            const { left, top, width, height } = menuOption.getBoundingClientRect();
            const rect = {x: left, y: top, width, height};
            setRect(rect);
        } 
    },[showContextMenu]);

    function onClick() {
        setShowContextMenu(true);
    }
    
    return (
        <div>
            <div ref={menuOptionRef} className={showContextMenu ? theme.itemSelected : ''} onClick={onClick}>
                {menuItem}
            </div>
            <Menu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} parentRect={rect} disableBackground={props.disableBackground}>
                {children}
            </Menu>
        </div>
    );
}