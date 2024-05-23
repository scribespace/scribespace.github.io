import { isIcon } from "@src/components/icon";
import { variableExistsOrThrowDev } from "@src/utils/common";
import { Children, ReactElement, cloneElement, useMemo } from "react";
import { MenuItemProps } from "./common";
import { MenuContextData, useMenuContext } from "./context";

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

    return (
        <div className={theme.item} onClick={props.onClick}>
           {children}
        </div>
      );
}