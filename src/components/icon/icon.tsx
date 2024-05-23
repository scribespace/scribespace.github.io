import { IconType, IconBaseProps } from "react-icons";

export default function Icon( icon: IconType ): IconType {
    function IconElement(props: IconBaseProps ) {
        return icon(props);
    }
    return IconElement;
}

