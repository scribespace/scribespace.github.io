import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import './css/contextMenuPlugin.css';
import { ContextMenuContext, ContextMenuContextObject } from "./contextMenuPlugin";

interface ContextMenuProps {
    parentRect: {x: number, y: number, width: number, height: number};
    disableBackground?: boolean
    showContextMenu: boolean
    setShowContextMenu: (show:boolean) => void;
    children: React.ReactNode;
}

export const ContextMenu = (props: ContextMenuProps) => {
    const contextObject: ContextMenuContextObject = useContext(ContextMenuContext)

    const [position, setPosition] = useState<{left: string, top: string}>({left:'-1px', top:'-1px'});

    const contextMenuContainerRef = useRef<HTMLDivElement>(null)   
    const contextMenuRef = useRef<HTMLDivElement>(null)

    const handleClick = ({target}: MouseEvent) =>
    {
        if (contextMenuContainerRef.current && contextMenuContainerRef.current.parentElement && !contextMenuContainerRef.current.parentElement.contains(target as Node)) {
            props.setShowContextMenu(false)
        }
    }

    const stopRightClick = (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
    }

    useEffect(()=>{
        document.addEventListener('click', handleClick)
        document.addEventListener('contextmenu', stopRightClick)

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', stopRightClick)
        }
    },[])

    useLayoutEffect(()=>{
        if ( !contextMenuRef.current ) return;

        const {width, height} = contextMenuRef.current?.getBoundingClientRect()

        const newPosition = {x: props.parentRect.x + props.parentRect.width, y: props.parentRect.y };

        const endPositionX = props.parentRect.x + props.parentRect.width + width;
        const endPositionY = props.parentRect.y + height;

        if ( endPositionX > window.innerWidth ) {
            newPosition.x = props.parentRect.x - width
        }

        if ( endPositionY > window.innerHeight ) {
            newPosition.y = props.parentRect.y - height
        }

        newPosition.x += window.scrollX;
        newPosition.y += window.scrollY;

        setPosition({left: `${newPosition.x}px`, top: `${newPosition.y}px`})
    },[props.showContextMenu, props.parentRect])

    return (
        <div ref={contextMenuContainerRef}>
            {
            props.showContextMenu && 
            <div ref={contextMenuRef} className={contextObject.theme.contextMenuFloat + (props.disableBackground ? '' : (' ' + contextObject.theme.contextMenuContainer))} style={{left:position.left, top:position.top}}>
                {props.children}
            </div>
            }
        </div>
    )
}