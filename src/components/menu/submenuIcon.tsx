import { IconBaseProps } from "react-icons";
import { MenuContextData, useMenuContext } from "./menuContext";

export default function SubmenuIcon() {
    const {theme}: MenuContextData = useMenuContext();

    function SubmenuIcon(iconProps: IconBaseProps) {
        return theme.SubmenuIcon(iconProps);
    }

    return <SubmenuIcon className={theme?.submenuIcon}/>;
}