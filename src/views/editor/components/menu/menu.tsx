import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MenuContextData, useMenuContext } from "./menuContext";

interface MenuProps {
    parentRect: {x: number, y: number, width: number, height: number};
    disableBackground?: boolean
    showMenu: boolean
    setShowMenu: (show:boolean) => void;
    children: React.ReactNode;
}

export default function Menu({parentRect, disableBackground, showMenu, setShowMenu, children}: MenuProps) {
    const menuContext: MenuContextData = useMenuContext();

    const [position, setPosition] = useState<{ left: string; top: string; }>({ left: '-1px', top: '-1px' });

    const menuContainerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = ({ target }: MouseEvent) => {
            if (menuContainerRef.current && menuContainerRef.current.parentElement && !menuContainerRef.current.parentElement.contains(target as Node)) {
                setShowMenu(false);
            }
        };

        const stopRightClick = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', stopRightClick);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', stopRightClick);
        };
    }, [setShowMenu]);

    useLayoutEffect(() => {
        if (!menuRef.current) return;

        const { width, height } = menuRef.current.getBoundingClientRect();

        function setToTheSide() {
            const newPosition = { x: parentRect.x + parentRect.width, y: parentRect.y };

            const endPositionX = parentRect.x + parentRect.width + width;
            const endPositionY = parentRect.y + height;

            if (endPositionX > window.innerWidth) {
                newPosition.x = parentRect.x - width;
            }

            if (endPositionY > window.innerHeight) {
                newPosition.y = parentRect.y - height;
            }

            newPosition.x += window.scrollX;
            newPosition.y += window.scrollY;

            setPosition({ left: `${newPosition.x}px`, top: `${newPosition.y}px` });
        }

        function setBelow() {
            const newPosition = { x: parentRect.x + parentRect.width * 0.5 - width * 0.5, y: parentRect.y + parentRect.height };

            const startPositionX = parentRect.x + parentRect.width * 0.5 - width * 0.5;
            const endPositionX = parentRect.x + parentRect.width * 0.5 + width * 0.5;
            const endPositionY = parentRect.y + parentRect.height + height;

            if (endPositionX > window.innerWidth) {
                const offset = window.innerWidth - endPositionX;
                newPosition.x += offset;
            }

            if (startPositionX < 0) {
                const offset = 0 - startPositionX;
                newPosition.x += offset;
            }

            if (endPositionY > window.innerHeight) {
                newPosition.y = parentRect.y - height;
            }

            newPosition.x += window.scrollX;
            newPosition.y += window.scrollY;

            setPosition({ left: `${newPosition.x}px`, top: `${newPosition.y}px` });
        }

        if ( menuContext.layout == 'below') {
            setBelow();
        } else {
            setToTheSide();
        }
    }, [showMenu, parentRect, menuContext.layout]);

    return (
        <div ref={menuContainerRef}>
            {showMenu &&
                <div ref={menuRef} className={menuContext.theme?.float + (disableBackground ? '' : (' ' + menuContext.theme?.container))} style={{ left: position.left, top: position.top }}>
                    {children}
                </div>}
        </div>
    );
}