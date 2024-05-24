import { isIcon } from "@src/components/icon";
import { variableExistsOrThrowDev } from "@src/utils/common";
import { Children, ReactElement, ReactNode, cloneElement, useMemo } from "react";
import { MenuContextData, useMenuContext } from "./menuContext";

interface MenuItemProps {
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export default function MenuItem(props: MenuItemProps) {
    const menuContext: MenuContextData = useMenuContext();

    const theme = useMemo(() => {
        variableExistsOrThrowDev(menuContext.theme);
        return menuContext.theme;
    },[menuContext.theme]);

    const children = useMemo(() => {
        const childrenArray = Children.toArray(props.children) as ReactElement[];

        return childrenArray.map((child) => {
             if (isIcon(child)) {
              return cloneElement(child, {
                size: theme.itemIconSize,
                className: `${theme.itemIcon} ${child.props.className}`,
              });
             }
            return child;
          });

    },[props.children, theme.itemIcon, theme.itemIconSize]);

    const className = useMemo(() => {
        return theme.item
        + (props.disabled ? (' ' + theme.itemDisabled): '');
    },[theme.item, theme.itemDisabled, props.disabled]);

    return (
        <div className={className} onClick={props.onClick}>
           {children}
        </div>
      );
}