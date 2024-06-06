import { ReactElement, useEffect, useRef } from "react";
import { MenuContext, MenuContextData } from "./menuContext";
import { MenuTheme } from "./theme";

interface MenuRootProps {
  value: MenuContextData<MenuTheme>;
  children: ReactElement | ReactElement[];
}

export default function MenuRoot({ value, children }: MenuRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const rootElement = rootRef.current;

    const stopRightClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    rootElement.addEventListener("contextmenu", stopRightClick);
    return () => {
      rootElement.removeEventListener("contextmenu", stopRightClick);
    };
  }, []);

  return (
    <MenuContext.Provider value={value}>
      <div ref={rootRef} style={{ display: "inherit" }}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}
