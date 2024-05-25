import { isIcon } from "@/components/icon";
import { Children, ReactElement, ReactNode, cloneElement, useMemo } from "react";
import { MenuContextData, useMenuContext } from "./menuContext";
import { variableExistsOrThrowDev } from "@/utils";

interface MenuItemProps {
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export default function MenuItem({disabled, onClick, children }: MenuItemProps) {
    const menuContext: MenuContextData = useMenuContext();

    const theme = useMemo(() => {
        variableExistsOrThrowDev(menuContext.theme);
        return menuContext.theme;
    },[menuContext.theme]);

    const preocessedChildren = useMemo(() => {
        const childrenArray = Children.toArray(children) as ReactElement[];

        return childrenArray.map((child) => {
             if (isIcon(child)) {
              return cloneElement(child, {
                size: theme.itemIconSize,
                className: `${theme.itemIcon} ${child.props.className}`,
              });
             }
            return child;
          });

    },[children, theme.itemIcon, theme.itemIconSize]);

    const className = useMemo(() => {
        return theme.item
        + (disabled ? (' ' + theme.itemDisabled): '');
    },[theme.item, theme.itemDisabled, disabled]);

    return (
        <div className={className} onClick={onClick}>
           {preocessedChildren}
        </div>
      );
}
