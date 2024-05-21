import { ReactNode, useCallback } from "react";
import { IconType } from "react-icons";
import { MenuContextData, useMenuContext } from "./context";

interface MenuItemProps {
    Icon?: IconType;
    title: string
    onClick?: () => void;
    children?: ReactNode;
}

export default function MenuItem({Icon, title, onClick, children}: MenuItemProps) {
    const menuContext: MenuContextData = useMenuContext()

    const GetIcon = useCallback( () => {
        if ( Icon )
            return <Icon className={menuContext.theme?.menuItemIcon}/>
        else 
            return <div className={menuContext.theme?.menuItemIcon}/>
    }, [menuContext.theme, Icon])

    return (
        <div className={menuContext.theme?.menuItem} onClick={onClick}>
           <GetIcon/>
           <div>{title}</div>
           {children}
        </div>
      )
}