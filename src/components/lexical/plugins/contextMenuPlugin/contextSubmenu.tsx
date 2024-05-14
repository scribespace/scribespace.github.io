import { useContext, useEffect, useRef, useState } from "react";
import { ContextMenu } from "./contextMenu";
import { FaAngleRight } from "react-icons/fa";
import { ContextMenuContext, ContextMenuTheme } from "./contextMenuPlugin";

interface ContextSubmenuProps {
    Option: ()=>React.ReactNode;
    children: React.ReactNode;
}

export default function ContextSubmenu(props: ContextSubmenuProps) {
    const theme = useContext(ContextMenuContext)

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

    const submenuRef = useRef<HTMLDivElement>(null)
    const contextMenuRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<{x: number, y: number}>({x: -1, y: -1});

    useEffect(()=>{
        const parentObject = contextMenuRef.current?.parentElement;
        if ( parentObject != null ){
            const { right, top } = parentObject.getBoundingClientRect();
            setPosition({x: right, y:top})
        }   
        setShowContextMenu(false)

    },[props.Option])

    function onClick() {
        setShowContextMenu(true)
    }

    return (
        <div ref={submenuRef} onClick={onClick}>
            <div className={theme.contextMenuItem + (showContextMenu ? ' selected' : '')}>
                <props.Option/>
                <FaAngleRight className={theme.contextMenuItemIcon}/>
            </div>
            <ContextMenu ref={contextMenuRef} showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} position={{x: position.x, y: position.y}}>
                {props.children}
            </ContextMenu>
        </div>
    )
}