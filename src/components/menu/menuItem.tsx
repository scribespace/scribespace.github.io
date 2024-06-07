import { isIcon } from "@/components";
import { useEditorEditable } from "@/hooks/useEditorEditable";
import { variableExists } from "@utils";
import { EditorThemeClassName } from "lexical";
import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  useMemo,
} from "react";
import { MenuContextData, useMenuContext } from "./menuContext";

interface MenuItemProps {
  disabled?: boolean;
  className?: EditorThemeClassName;
  onClick?: (event: React.MouseEvent) => void;
  children?: ReactNode;
}

export default function MenuItem({
  disabled,
  className,
  onClick,
  children,
}: MenuItemProps) {
  const menuContext: MenuContextData = useMenuContext();

  const isEditorEditable = useEditorEditable();

  const isDisabled = useMemo(() => {
    return disabled || !isEditorEditable;
  }, [disabled, isEditorEditable]);

  const theme = useMemo(() => {
    return menuContext.theme;
  }, [menuContext.theme]);

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
  }, [children, theme.itemIcon, theme.itemIconSize]);

  const selectedClassName = useMemo(() => {
    const mainClassName = variableExists(className)
      ? className
      : theme.itemDefault;

    return mainClassName + (isDisabled ? " " + theme.itemDisabled : "");
  }, [className, theme.itemDefault, theme.itemDisabled, isDisabled]);

  return (
    <div
      className={selectedClassName}
      onClick={(event) => {
        if (onClick && !isDisabled) onClick(event);
      }}
    >
      {preocessedChildren}
    </div>
  );
}
