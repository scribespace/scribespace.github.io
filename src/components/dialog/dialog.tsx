import { useMainThemeContext } from "@/mainThemeContext";
import { mergeRegister } from "@lexical/utils";
import { Command } from "@systems/commandsManager/command";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CLOSE_ALL_WINDOWS_CMD } from "../shortcuts/shortcutsCommands";
import { variableExists } from "@utils";

interface DialogProps {
    commandOpen: Command<unknown>,
    commandClose?: Command<unknown>,
    children: ReactNode,
}

export function Dialog({commandOpen, commandClose, children}: DialogProps) {
    const constStyle: React.CSSProperties = { 
        position: "fixed", 
        zIndex: 5,
        maxHeight: "70%",
        left: "50%",
        top: "10%",
        translate: "-50% 0%",
        overflow: "auto",
    };
    const {commonTheme: {dialogTheme}} = useMainThemeContext();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    const forceCloseDialog = useCallback(
        () => {
            setShowDialog( false );
        },
        []
    );
    const closeDialog = useCallback(
        () => {
            if ( !variableExists(commandClose) ) {
                forceCloseDialog();
            }
        },
        [commandClose, forceCloseDialog]
    );

    const onClick = useCallback(
        (event: MouseEvent) => {
            if ( !dialogRef.current?.contains(event.target as Node) )
                closeDialog();
        },
        [closeDialog]
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
        const commandCloseListener = 
        variableExists(commandClose) ?
        $registerCommandListener(
            commandClose,
            () => {
                forceCloseDialog();
            }
        ) :
        () => {};


        return mergeRegister(
                $registerCommandListener(
                    commandOpen,
                    () => {
                        setShowDialog(true);
                    }
                ),
                commandCloseListener,
                $registerCommandListener(
                    CLOSE_ALL_WINDOWS_CMD,
                    () => {
                        closeDialog();
                    }
                )
            );
        },
        [closeDialog, commandOpen, commandClose, forceCloseDialog]
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