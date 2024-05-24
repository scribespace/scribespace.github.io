import { ReactNode } from "react";

export interface MenuItemProps {
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}
