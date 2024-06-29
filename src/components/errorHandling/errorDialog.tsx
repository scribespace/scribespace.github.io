import { useMainThemeContext } from "@/mainThemeContext";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { variableExists } from "@utils";
import { useEffect, useState } from "react";
import { Dialog } from "../dialog/dialog";
import { ERROR_OPEN_DIALOG } from "./errorCommands";


export function ErrorDialog() {
    const {commonTheme: {errorTheme}} = useMainThemeContext();
    const [errorMsg, setErrorMsg] = useState('');
    const [errorStack, setErrorStack] = useState('');
    useEffect(
        () => {
            return $registerCommandListener(
                ERROR_OPEN_DIALOG,
                (error) => {
                    setErrorMsg(`${error.message}: ${error.toString()}`);
                    if ( variableExists(error.stack)) {
                        setErrorStack( error.stack );
                    }
                }
            );
        },
        []
    );

    return (
        <Dialog commandOpen={ERROR_OPEN_DIALOG}>
            <div className={errorTheme.container}>
                <p className={errorTheme.msg}>{errorMsg}</p>
                <p className={errorTheme.callstack} style={{overflow:'scroll', whiteSpace:'pre'}}>{errorStack}</p>
            </div>
        </Dialog>
    );
}