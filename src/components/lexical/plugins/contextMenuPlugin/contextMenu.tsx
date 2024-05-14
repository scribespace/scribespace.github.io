import { forwardRef, useContext, useEffect,useImperativeHandle,useRef } from "react"

import './css/contextMenuPlugin.css'
import { ContextMenuContext } from "./contextMenuPlugin";


interface ContextMenuProps {
    position: {x: number, y: number};
    showContextMenu: boolean
    setShowContextMenu: (show:boolean) => void;
    children: React.ReactNode;
}

export const ContextMenuSeparator = () => {
    const theme = useContext(ContextMenuContext)

    return <div className={theme.contextMenuSeparator}/>
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>( (props: ContextMenuProps, outContextMenuRef) => {
    const theme = useContext(ContextMenuContext)
    
    const contextMenuRef = useRef<HTMLDivElement>(null)   
    useImperativeHandle(outContextMenuRef, () => contextMenuRef.current!, []);

    const handleClick = ({target}: MouseEvent) =>
    {
        if (contextMenuRef.current && contextMenuRef.current.parentElement && !contextMenuRef.current.parentElement.contains(target as Node)) {
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

    return (
        <div ref={contextMenuRef}>
            {
            props.showContextMenu && 
            <div className={theme.contextMenuContainer} style={{top:`${props.position.y}px`, left:`${props.position.x}px`}}>
                {props.children}
            </div>
            }
        </div>
    )
})