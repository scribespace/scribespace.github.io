import { ReactElement, useCallback, useContext } from "react";
import { IconType } from "react-icons";
import { ContextMenuContext, ContextMenuContextObject } from "./contextMenuPlugin";

export interface ContextMenuItemProps {
    Icon?: IconType;
    title: string
    onClick?: () => void;
    children?: ReactElement;
}

export default function ContextMenuItem({Icon, title, onClick, children}: ContextMenuItemProps) {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const GetIcon = useCallback( () => {
        if ( Icon )
            return <Icon className={contextObject.theme.contextMenuItemIcon}/>
        else 
            return <div className={contextObject.theme.contextMenuItemIcon}/>
    }, [Icon])

    return (
        <div className={contextObject.theme.contextMenuItem} onClick={onClick}>
           <GetIcon/>
           <div>{title}</div>
           {children}
        </div>
      )
}