import { ReactNode, useCallback } from "react";
import { IconType } from "react-icons";
import { MenuContextData, getMenuContext } from "./context";

interface MenuItemProps {
    Icon?: IconType;
    title: string
    onClick?: () => void;
    children?: ReactNode;
}

export default function MenuItem({Icon, title, onClick, children}: MenuItemProps) {
    const menuContext: MenuContextData = getMenuContext()

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