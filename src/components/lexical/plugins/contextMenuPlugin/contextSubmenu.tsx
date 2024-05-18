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
    const [position, setPosition] = useState<{x: number, y: number}>({x: -1, y: -1});

    useEffect(()=>{
        const menuOption = menuOptionRef.current;
        if ( menuOption != null ){
            const { right, top } = menuOption.getBoundingClientRect();
            setPosition({x: right, y:top})
        }   
        setShowContextMenu(false)

    },[props.Option])

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
            <ContextMenu showContextMenu={showContextMenu} setShowContextMenu={setShowContextMenu} position={{x: position.x, y: position.y}} disableBackground={props.disableBackground}>
                {props.children}
            </ContextMenu>
        </div>
    )
}