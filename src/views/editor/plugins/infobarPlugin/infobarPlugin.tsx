import { useMainThemeContext } from "@/mainThemeContext";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { forwardRef, useEffect, useRef } from "react";
import { INFOBAR_SUBMIT_INFO_CMD } from "./infoCommands";

export const InfobarPlugin = forwardRef<HTMLDivElement>((_, ref) => {
    const {editorTheme: {infobarTheme}} = useMainThemeContext();
    const infoRef = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            return $registerCommandListener(
                INFOBAR_SUBMIT_INFO_CMD,
                (msg) => {
                    if ( infoRef.current ) {
                        infoRef.current.innerText = msg;
                    }
                }
            );
        },
        []
    );

    return (
        <div ref={ref}>
            <div className={infobarTheme.container}>
                <div ref={infoRef} className={infobarTheme.info}>
                    
                </div>
            </div>
        </div>
    );
});
