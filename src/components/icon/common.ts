import { ReactElement } from "react";

export const ICON_ELEMENT_NAME = "IconElement";
export function isIcon(element: ReactElement): boolean {
    return element && typeof element.type === 'function' && element.type.name === ICON_ELEMENT_NAME;
}

