import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { ContextMenu } from "./contextMenu";
import { FaAngleRight } from "react-icons/fa";
import { ContextMenuContext, ContextMenuContextObject } from "./contextMenuPlugin";

export interface CotextSubmenuOptionProps {
    children?: ReactElement
}

interface ContextSubmenuProps {
    Option: ({children}:CotextSubmenuOptionProps)=>React.ReactNode;
    disableBackground?: boolean;
    children: React.ReactNode;
}

export default function ContextSubmenu(props: ContextSubmenuProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

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
        <div onClick={onClick}>
            <props.Option>
                <FaAngleRight className={contextObject.theme.contextMenuItemSubmenuIcon}/>
            </props.Option>
            <ContextMenu ref={contextMenuRef} showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} position={{x: position.x, y: position.y}} disableBackground={props.disableBackground}>
                {props.children}
            </ContextMenu>
        </div>
    )
}