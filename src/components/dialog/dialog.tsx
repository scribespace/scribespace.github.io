import { useMainThemeContext } from "@/mainThemeContext";
import { mergeRegister } from "@lexical/utils";
import { Command } from "@systems/commandsManager/command";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CLOSE_ALL_WINDOWS_CMD } from "../shortcuts/shortcutsCommands";

interface DialogProps {
    command: Command<unknown>,
    children: ReactNode,
}

export function Dialog({command, children}: DialogProps) {
    const constStyle: React.CSSProperties = { 
        position: "fixed", 
        zIndex: 5,
        left: "50%",
        top: "10%",
        translate: "-50% 0%"
    };
    const {commonTheme: {dialogTheme}} = useMainThemeContext();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    const onClick = useCallback(
        (event: MouseEvent) => {
            if ( !dialogRef.current?.contains(event.target as Node) )
                setShowDialog(false);
        },
        []
    );

    useEffect(
        () => {
            document.addEventListener("click", onClick);
            return () => { document.removeEventListener( "click", onClick ); };
        },
        [onClick]
    );


    useEffect(
        () => {
        return mergeRegister(
                $registerCommandListener(
                    command,
                    () => {
                        setShowDialog(true);
                    }
                ),
                $registerCommandListener(
                    CLOSE_ALL_WINDOWS_CMD,
                    () => {
                        setShowDialog(false);
                    }
                )
            );
        },
        [command]
    );
    
    return (
        <>
        {showDialog && 
            createPortal(
                <div ref={dialogRef} className={dialogTheme.container} style={constStyle}>
                    {children}
                </div>
                , document.body
            )
        }
        </>
    );
}