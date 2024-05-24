import { IconBaseProps } from "react-icons";
import { MenuContextData, useMenuContext } from "./menuContext";
import { variableExistsOrThrowDev } from "@src/utils/common";

export default function SubmenuIcon() {
    const {theme}: MenuContextData = useMenuContext();

    function SubmenuIcon(iconProps: IconBaseProps) {
        variableExistsOrThrowDev(theme?.SubmenuIcon);
        return theme.SubmenuIcon(iconProps);
    }

    return <SubmenuIcon className={theme?.submenuIcon}/>;
}