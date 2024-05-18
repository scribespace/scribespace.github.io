import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { ContextMenu } from "./contextMenu";
import { ContextMenuContext, ContextMenuContextObject } from "./contextMenuPlugin";
import { IconBaseProps } from "react-icons";

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

    const menuOptionRef = useRef<HTMLDivElement>(null)
    const [rect, setRect] = useState<{x: number, y: number, width: number, height: number}>({x: -1, y: -1, width: 0, height: 0});

    useEffect(()=>{
        setShowContextMenu(false)
    },[props.Option])

    useEffect(()=>{
        const menuOption = menuOptionRef.current;
        if ( menuOption != null ){
            const { left, top, width, height } = menuOption.getBoundingClientRect();
            const rect = {x: left, y: top, width, height}
            setRect(rect)
        } 
    },[showContextMenu])

    function onClick() {
        setShowContextMenu(true)
    }

    function SubmenuIcon(props: IconBaseProps) {
        return contextObject.icons.SubmenuIcon(props)
    }
    
    return (
        <div ref={menuOptionRef} onClick={onClick}>
            <props.Option>
                <SubmenuIcon className={contextObject.theme.contextMenuItemSubmenuIcon}/>
            </props.Option>
            <ContextMenu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} parentRect={rect} disableBackground={props.disableBackground}>
                {props.children}
            </ContextMenu>
        </div>
    )
}