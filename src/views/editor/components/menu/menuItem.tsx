import { isIcon } from "@/components/icon";
import { Children, ReactElement, ReactNode, cloneElement, useMemo } from "react";
import { MenuContextData, useMenuContext } from "./menuContext";
import { variableExists, variableExistsOrThrowDev } from "@/utils";
import { EditorThemeClassName } from "lexical";

interface MenuItemProps {
    disabled?: boolean;
    className?: EditorThemeClassName;
    onClick?: (event: React.MouseEvent) => void;
    children?: ReactNode;
}

export default function MenuItem({disabled, className, onClick, children }: MenuItemProps) {
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

    const selectedClassName = useMemo(() => {
        const mainClassName = variableExists(className) ? className : theme.itemDefault;

        return mainClassName
        + (disabled ? (' ' + theme.itemDisabled): '');
    },[className, theme.itemDefault, theme.itemDisabled, disabled]);

    return (
        <div className={selectedClassName} onClick={onClick}>
           {preocessedChildren}
        </div>
      );
}
