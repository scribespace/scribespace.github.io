import { ReactElement, useCallback, useContext } from "react";
import { IconType } from "react-icons";
import { MenuContext, MenuContextData } from "./menu";

export interface ContextMenuItemProps {
    Icon?: IconType;
    title: string
    onClick?: () => void;
    children?: ReactElement;
}

export default function MenuItem({Icon, title, onClick, children}: ContextMenuItemProps) {
    const menuContext: MenuContextData = useContext(MenuContext)

    const GetIcon = useCallback( () => {
        if ( Icon )
            return <Icon className={menuContext.theme?.menuItemIcon}/>
        else 
            return <div className={menuContext.theme?.menuItemIcon}/>
    }, [Icon])

    return (
        <div className={menuContext.theme?.menuItem} onClick={onClick}>
           <GetIcon/>
           <div>{title}</div>
           {children}
        </div>
      )
}