import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MenuContextData, useMenuContext } from "./menuContext";
import { EditorThemeClassName } from "lexical";
import { variableExists } from "@/utils";

interface MenuProps {
  parentRect: { x: number; y: number; width: number; height: number };
  className?: EditorThemeClassName;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  children: React.ReactNode;
}

export default function Menu({
  parentRect,
  className,
  showMenu,
  setShowMenu,
  children,
}: MenuProps) {
  const menuContext: MenuContextData = useMenuContext();

  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: parentRect.width,
    top: 0,
  });

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedClassName: EditorThemeClassName = useMemo(() => {
    if (variableExists(className)) return className;
    return menuContext.theme.containerDefault;
  }, [className, menuContext.theme.containerDefault]);

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      if (
        menuContainerRef.current &&
        menuContainerRef.current.parentElement &&
        !menuContainerRef.current.parentElement.contains(target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setShowMenu]);

  useLayoutEffect(() => {
    if (!menuRef.current) return;

    const { width, height } = menuRef.current.getBoundingClientRect();

    function setToTheSide() {
      const newPosition = { x: parentRect.width, y: 0 };

      const endPositionX = parentRect.x + parentRect.width + width;
      const endPositionY = parentRect.y + parentRect.height + height;

      if (endPositionX > window.innerWidth) {
        newPosition.x = -width;
      }

      if (endPositionY > window.innerHeight) {
        newPosition.y = -height;
      }

      setPosition({ left: newPosition.x, top: newPosition.y });
    }

    function setBelow() {
      const newPosition = {
        x: parentRect.width * 0.5 - width * 0.5,
        y: parentRect.height,
      };

      const startPositionX =
        parentRect.x + parentRect.width * 0.5 - width * 0.5;
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
        newPosition.y = -height;
      }

      setPosition({ left: newPosition.x, top: newPosition.y });
    }

    if (menuContext.layout == "below") {
      setBelow();
    } else {
      setToTheSide();
    }
  }, [
    showMenu,
    parentRect.x,
    parentRect.y,
    parentRect.width,
    parentRect.height,
    menuContext.layout,
  ]);

  return (
    <div ref={menuContainerRef}>
      {showMenu && (
        <div
          ref={menuRef}
          className={selectedClassName}
          style={{
            zIndex: 5,
            position: "absolute",
            left: `${position.left}px`,
            top: `${position.top}px`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
